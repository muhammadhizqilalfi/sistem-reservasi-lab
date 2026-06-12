// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. ENDPOINT POST: Mahasiswa mengajukan reservasi lab (+ opsi pinjam alat)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, labCode, date, startTime, endTime, purpose, items } = body;

    // Validasi data input wajib
    if (!userId || !labCode || !date || !startTime || !endTime || !purpose) {
      return NextResponse.json({ message: "Data formulir tidak lengkap" }, { status: 400 });
    }

    // Eksekusi transaksi database (Reservasi + otomatis simpan alat terpinjam jika ada)
    const newReservation = await prisma.$transaction(async (tx) => {
      // a. Buat data reservasi utama
      const reservation = await tx.reservation.create({
        data: {
          userId,
          labCode,
          date: new Date(date),
          startTime,
          endTime,
          purpose,
          status: "PENDING",
        },
      });

      // b. Jika mahasiswa sekaligus mencentang dan memilih alat lab
      if (items && items.length > 0) {
        for (const item of items) {
          if (item.quantity > 0) {
            // Catat alat ke tabel penghubung LoanItem
            await tx.loanItem.create({
              data: {
                equipmentId: item.equipmentId,
                quantity: item.quantity,
                reservationId: reservation.id,
              },
            });

            // Kurangi stok tersedia (availableStock) di tabel Equipment secara otomatis
            await tx.equipment.update({
              where: { id: item.equipmentId },
              data: {
                availableStock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      }

      return reservation;
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal membuat reservasi lab", error }, { status: 500 });
  }
}

// 2. ENDPOINT GET: Mengambil data reservasi (Bisa untuk antrean Admin atau Riwayat Mahasiswa)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Filter jika dikirim param ?userId=...

    let reservations;

    if (userId) {
      // Jika ada userId, berarti Mahasiswa/Dosen sedang meminta riwayat personal mereka sendiri
      reservations = await prisma.reservation.findMany({
        where: { userId },
        include: { lab: true },
        orderBy: { date: "desc" },
      });
    } else {
      // Jika tidak ada parameter userId, berarti Admin Staf Lab meminta semua antrean pengajuan
      reservations = await prisma.reservation.findMany({
        include: {
          user: true, // Ambil info nama mahasiswa pemohon
          lab: true,  // Ambil info nama lab
          loanItems: {
            include: { equipment: true }, // Ambil info alat apa saja yang dia pinjam
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal memuat data reservasi", error }, { status: 500 });
  }
}