import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

// Helper untuk memverifikasi token JWT secara berulang
function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Akses ditolak. Token tidak ditemukan.");
  }
  const token = authHeader.split(" ")[1];
  
  // Verifikasi token asli tanpa langsung memaksa tipe data
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // LOG DEBUGGING: Pantau isi token Anda di terminal VS Code saat tombol diklik
  console.log("=== [DEBUG] ISI PAYLOAD TOKEN MAHASISWA ===", decoded);
  
  return decoded;
}

// ==========================================
// 1. GET: MENGAMBIL DAFTAR RESERVASI
// ==========================================
export async function GET(request: Request) {
  try {
    try {
      verifyToken(request);
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Sesi tidak valid." }, { status: 401 });
    }

    const allBookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        laboratory: { 
          select: {
            name: true,
            code: true,
          },
        },
        equipments: {
          include: {
            equipment: true
          }
        }
      },
      orderBy: {
        date: "desc", 
      },
    });

    const formattedBookings = allBookings.map((booking: any) => ({
      ...booking,
      lab: booking.laboratory, 
    }));

    return NextResponse.json(formattedBookings, { status: 200 });

  } catch (error) {
    console.error("Gagal mengambil data reservasi:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. POST: PROSES PENGAJUAN RESERVASI BARU
// ==========================================
export async function POST(request: Request) {
  try {
    let decodedUser: any;
    try {
      decodedUser = verifyToken(request);
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Sesi login kedaluwarsa." }, { status: 401 });
    }

    const actualUserId = decodedUser.id || decodedUser.userId || decodedUser.sub;

    if (!actualUserId) {
      return NextResponse.json(
        { error: "Sesi login tidak valid (ID Pengguna tidak ditemukan dalam token). Silakan re-login." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { labId, date, startTime, endTime, purpose, includeLoan, loanDetails } = body;

    // 2. Validasi input data dasar
    if (!labId || !date || !startTime || !endTime || !purpose) {
      return NextResponse.json({ error: "Form pengajuan wajib diisi lengkap." }, { status: 400 });
    }

    // 3. Gunakan Prisma Transaction agar booking dan data alat tersimpan aman bersamaan
    const result = await prisma.$transaction(async (tx) => {
      
      // a. Buat data induk Booking (Reservasi Lab)
      const booking = await tx.booking.create({
        data: {
          userId: actualUserId, // 👈 Menggunakan ID hasil ekstraksi aman di atas
          labId: labId,
          date: new Date(date),
          startTime: startTime,
          endTime: endTime,
          purpose: purpose,
          status: "PENDING", 
        },
      });

      // b. Jika user mencentang pinjam alat DAN isi keranjang (cart) tidak kosong
      if (includeLoan && loanDetails && loanDetails.items.length > 0) {
        
        const bookingEquipmentsData = loanDetails.items.map((item: any) => ({
          bookingId: booking.id,     
          equipmentId: item.id,      
          quantity: item.quantity,   
        }));

        await tx.bookingEquipment.createMany({
          data: bookingEquipmentsData,
        });
      }

      return booking;
    });

    return NextResponse.json({ 
      success: true, 
      message: "Reservasi laboratorium dan peminjaman alat berhasil dikirim!", 
      data: result 
    }, { status: 201 });

  } catch (error) {
    console.error("Error pada API POST reservations:", error);
    return NextResponse.json(
      { error: "Terjadi kegagalan sistem database saat membuat reservasi." },
      { status: 500 }
    );
  }
}