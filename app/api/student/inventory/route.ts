import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

// --- [GET] Ambil Katalog Inventaris Alat ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "Semua";

    // Build filter query prisma
    const whereClause: any = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };

    // Jika filter kategori dipilih dan bukan "Semua"
    if (category !== "Semua") {
      whereClause.type = category;
    }

    const items = await prisma.equipment.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("GET Inventory Error:", error);
    return NextResponse.json({ error: "Gagal memuat katalog" }, { status: 500 });
  }
}

// --- [POST] Ajukan Peminjaman Alat ---
export async function POST(request: Request) {
  try {
    // 1. Ekstrak & Verifikasi Token JWT dari Headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Akses ditolak. Token tidak ditemukan." }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Sesi habis, silakan login kembali." }, { status: 401 });
    }

    const loggedInUserId = decoded.userId;

    // 2. Ambil Request Body dari Client
    const body = await request.json();
    const { returnDate, items } = body; // items = [{ id: "...", quantity: 2 }]

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Keranjang pinjaman kosong" }, { status: 400 });
    }

    // 3. Ambil data Laboratory secara acak/default untuk memenuhi relasi labId yang REQUIRED di schema
    const defaultLab = await prisma.laboratory.findFirst(); // Memakai 'laboratory' sesuai schema
    if (!defaultLab) {
      return NextResponse.json({ error: "Data laboratorium belum dikonfigurasi di DB." }, { status: 500 });
    }

    // 4. Jalankan ACID Transaction di Prisma
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Buat data induk Booking
      const booking = await tx.booking.create({
        data: {
          userId: loggedInUserId,
          labId: defaultLab.id,
          // Karena di schema tidak ada returnDate, kita simpan informasi tanggal kembali ke kolom 'purpose'
          purpose: `Peminjaman Logistik Alat. Rencana Pengembalian: ${returnDate}`,
          date: new Date(), // Tanggal pengajuan (Hari ini)
          startTime: "00:00", // Placeholder default jam karena kolomnya required
          endTime: "00:00",   // Placeholder default jam karena kolomnya required
          status: "PENDING",
        },
      });

      // B. Looping untuk validasi stock, kurangi stock, dan create data BookingEquipment
      for (const item of items) {
        // Ambil data stok terupdate langsung di dalam transaksi
        const equipment = await tx.equipment.findUnique({
          where: { id: item.id },
        });

        if (!equipment) {
          throw new Error(`Alat dengan ID ${item.id} tidak ditemukan.`);
        }

        if (equipment.availableStock < item.quantity) {
          throw new Error(`Stok alat '${equipment.name}' tidak mencukupi.`);
        }

        // Update kurangi ketersediaan stok di tabel Equipment
        await tx.equipment.update({
          where: { id: item.id },
          data: {
            availableStock: equipment.availableStock - item.quantity,
          },
        });

        // Masukkan relasi jembatan ke tabel BookingEquipment
        await tx.bookingEquipment.create({
          data: {
            bookingId: booking.id,
            equipmentId: item.id,
            quantity: item.quantity,
          },
        });
      }

      return booking;
    });

    return NextResponse.json({
      message: "⚠️ Pengajuan peminjaman alat berhasil dikirim ke antrean asisten lab!",
      booking: result,
    }, { status: 200 });

  } catch (error: any) {
    console.error("POST Booking Equipment Runtime Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}