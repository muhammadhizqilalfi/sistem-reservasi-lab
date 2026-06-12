import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Samakan persis dengan kunci JWT_SECRET pada route login kamu
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

export async function POST(request: Request) {
  try {
    // 1. Ambil token JWT dari Header 'Authorization'
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Akses ditolak. Token autentikasi tidak ditemukan." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // 2. Verifikasi keaslian Token JWT secara manual
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Sesi login Anda telah kedaluwarsa atau tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    // 3. Validasi apakah user yang login benar-benar seorang LECTURER
    if (decoded.role !== "LECTURER") {
      return NextResponse.json(
        { error: "Akses ditolak. Fitur ini hanya diperuntukkan bagi akun Dosen." },
        { status: 403 }
      );
    }

    // 4. Tangkap parameter dari form bulk-scheduling frontend
    const body = await request.json();
    const { 
      labId, 
      subjectName, 
      classSection, 
      startTime, 
      endTime, 
      startDate, 
      recurrenceWeeks 
    } = body;

    if (!labId || !subjectName || !classSection || !startTime || !endTime || !startDate || !recurrenceWeeks) {
      return NextResponse.json({ error: "Sila isi semua parameter konfigurasi kelas" }, { status: 400 });
    }

    const totalWeeks = Number(recurrenceWeeks);
    const baseDate = new Date(startDate);
    const purposeText = `Praktikum Massal Semester: ${subjectName} (Kelas ${classSection})`;

    // 5. Jalankan Prisma Transaction untuk bulk insert
    const createdBookings = await prisma.$transaction(async (tx) => {
      const bookingsArray = [];

      for (let i = 0; i < totalWeeks; i++) {
        const currentBookingDate = new Date(baseDate);
        currentBookingDate.setDate(baseDate.getDate() + (i * 7));

        const newSession = await tx.booking.create({
          data: {
            userId: decoded.userId,
            labId: labId,
            purpose: purposeText,
            date: currentBookingDate,
            startTime: startTime,
            endTime: endTime,
            status: "APPROVED",
          },
        });
        bookingsArray.push(newSession);
      }
      return bookingsArray;
    });

    return NextResponse.json({ 
      message: `Berhasil mem-plotting massal ${createdBookings.length} pertemuan praktikum untuk satu semester.`,
      bookings: createdBookings 
    }, { status: 201 });

  } catch (error) {
    console.error("Bulk Scheduling Custom JWT Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan rangkaian plotting jadwal" }, { status: 500 });
  }
}