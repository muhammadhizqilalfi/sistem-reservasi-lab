// app/api/reservations/reschedule/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, newDate, newStartTime, newEndTime, reason } = body;

    // Validasi data input wajib
    if (!bookingId || !newDate || !newStartTime || !newEndTime || !reason) {
      return NextResponse.json({ message: "Data formulir tidak lengkap" }, { status: 400 });
    }

    // 1. Cari data booking asli di database
    const oldBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!oldBooking) {
      return NextResponse.json({ message: "Data booking tidak ditemukan" }, { status: 404 });
    }

    // 2. Update jadwal lama dengan waktu baru, dan reset status menjadi PENDING
    // Kita juga selipkan alasan reschedule ke dalam kolom purpose agar Admin bisa membaca alasannya
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: new Date(newDate),
        startTime: newStartTime,
        endTime: newEndTime,
        status: "PENDING", // Otomatis masuk antrean approve admin lagi
        purpose: `${oldBooking.purpose} [MOHON RESCHEDULE: ${reason}]`,
      },
    });

    return NextResponse.json({ message: "Permohonan reschedule berhasil dikirim", updatedBooking }, { status: 200 });
  } catch (error) {
    console.error("Error Reschedule API:", error);
    return NextResponse.json({ message: "Gagal memproses permohonan reschedule", error }, { status: 500 });
  }
}