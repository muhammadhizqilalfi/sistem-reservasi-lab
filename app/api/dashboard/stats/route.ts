// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

export async function GET(request: Request) {
  try {
    // 1. VALIDASI PASPOR TOKEN (JWT)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Otorisasi gagal: Token tidak ditemukan!" }, { status: 401 });
    }

    // Verifikasi keaslian token sesi browser
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Sesi habis, silakan login kembali." }, { status: 401 });
    }

    const { userId, role } = decoded;

    // 2. KONDISIONAL QUERY BERDASARKAN ROLE (GLOBAL VS PERSONAL)
    // Jika LABSTAFF -> Kondisi filter kosong {} (melihat semua)
    // Jika STUDENT/LECTURER -> Kondisi filter dikunci ke userId mereka
    const isAdmin = role === "LABSTAFF";
    const scopeWhereCondition = isAdmin ? {} : { userId: userId };

    // 3. EKSEKUSI HITUNG METRIKS AGREGASI DARI DATABASE
    const [totalReservasi, pendingReservasi, approvedReservasi, totalLaboratorium] = await Promise.all([
      // Total semua pengajuan (termasuk rejected)
      prisma.booking.count({
        where: scopeWhereCondition,
      }),
      // Total berkas yang butuh konfirmasi
      prisma.booking.count({
        where: { ...scopeWhereCondition, status: "PENDING" },
      }),
      // Total sesi praktikum yang sah/aktif
      prisma.booking.count({
        where: { ...scopeWhereCondition, status: "APPROVED" },
      }),
      // Total laboratorium yang terdaftar di sistem (Selalu global)
      prisma.laboratory.count(),
    ]);

    // 4. AMBIL LIST AKTIVITAS TERBARU (RECENT ACTIVITIES)
    const recentBookings = await prisma.booking.findMany({
      where: scopeWhereCondition,
      take: 5, // Ambil 5 data terbaru saja untuk widget ringkasan
      orderBy: {
        createdAt: "desc", // Urutkan dari yang paling baru di-submit
      },
      include: {
        user: {
          select: { name: true, role: true }, // Ambil nama & role pemohon
        },
        laboratory: {
          select: { name: true }, // Ambil nama lab target
        },
      },
    });

    // 5. KIRIM DATA MATANG KE FRONTEND DASHBOARD
    return NextResponse.json({
      metrics: {
        totalReservasi,
        pendingReservasi,
        approvedReservasi,
        totalLaboratorium,
      },
      recentActivity: recentBookings.map((b) => ({
        id: b.id,
        pemohon: b.user?.name || "User Luar",
        rolePemohon: b.user?.role || "STUDENT",
        laboratorium: b.laboratory?.name || "Lab Umum",
        tujuan: b.purpose.split("[MOHON")[0],
        tanggal: b.date,
        status: b.status,
      })),
    }, { status: 200 });

  } catch (error) {
    console.error("Error Dashboard Stats Engine Runtime:", error);
    return NextResponse.json({ message: "Gagal memuat ringkasan data dashboard", error }, { status: 500 });
  }
}