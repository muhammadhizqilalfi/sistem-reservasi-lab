// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    if (!userId || !role) {
      return NextResponse.json({ message: "Parameter tidak lengkap" }, { status: 400 });
    }

    // --------------------------------------------------
    // KONDISI 1: STATISTIK UNTUK MAHASISWA (STUDENT)
    // --------------------------------------------------
    if (role === "STUDENT") {
      const activeBookingsCount = await prisma.booking.count({
        where: { userId, status: { in: ["PENDING", "APPROVED"] } },
      });

      // Menghitung jumlah total alat praktikum yang sedang dipinjam
      const borrowedEquipment = await prisma.bookingEquipment.aggregate({
        where: { booking: { userId, status: "APPROVED" } },
        _sum: { quantity: true },
      });

      const recentActivities = await prisma.booking.findMany({
        where: { userId },
        include: { laboratory: true },
        orderBy: { createdAt: "desc" },
        take: 3, // Ambil 3 data teratas saja
      });

      return NextResponse.json({
        activeBookings: activeBookingsCount,
        totalEquipment: borrowedEquipment._sum.quantity || 0,
        recentActivities,
      });
    }

    // --------------------------------------------------
    // KONDISI 2: STATISTIK UNTUK DOSEN (LECTURER)
    // --------------------------------------------------
    if (role === "LECTURER") {
      const classCount = await prisma.booking.count({
        where: { userId, status: "APPROVED" },
      });

      const pendingReschedule = await prisma.booking.count({
        where: { userId, status: "PENDING", purpose: { contains: "MOHON RESCHEDULE" } },
      });

      return NextResponse.json({
        classes: classCount,
        pendingReschedule,
      });
    }

    // --------------------------------------------------
    // KONDISI 3: STATISTIK UNTUK ADMIN (LABSTAFF)
    // --------------------------------------------------
    if (role === "LABSTAFF") {
      const pendingCount = await prisma.booking.count({
        where: { status: "PENDING" },
      });

      const brokenEquipmentCount = await prisma.equipment.count({
        where: { condition: "Rusak" },
      });

      const totalUsersCount = await prisma.user.count();

      // Hitung utilisasi ruang (Lab terpakai hari ini)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const occupiedLabsToday = await prisma.booking.count({
        where: { date: today, status: "APPROVED" },
      });
      const totalLabs = await prisma.laboratory.count();

      return NextResponse.json({
        pendingApprovals: pendingCount,
        brokenEquipment: brokenEquipmentCount,
        totalUsers: totalUsersCount,
        occupiedLabs: occupiedLabsToday,
        totalLabs: totalLabs || 1,
      });
    }

    return NextResponse.json({ message: "Role tidak dikenali" }, { status: 400 });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ message: "Gagal memuat statistik", error }, { status: 500 });
  }
}