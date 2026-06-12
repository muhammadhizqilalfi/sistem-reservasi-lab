// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ==========================================
// 1. ENDPOINT GET: Memuat Data Profil Akun
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID tidak ditemukan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan di database" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error GET Profile:", error);
    return NextResponse.json({ message: "Gagal memuat profil", error }, { status: 500 });
  }
}

// ==========================================
// 2. ENDPOINT PUT: Memperbarui Profil & Sandi
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, oldPassword, newPassword } = body;

    // 🟢 REVISI: Validasi dipisah agar pesan tidak mengecoh saat userId kosong
    if (!userId) {
      return NextResponse.json({ message: "Gagal memproses: User ID tidak ikut terkirim!" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ message: "Data nama wajib diisi!" }, { status: 400 });
    }

    // Ambil data user dari DB untuk verifikasi kata sandi lama
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan di database" }, { status: 404 });
    }

    // Siapkan objek tampungan untuk pembaruan
    let dataToUpdate: any = {
      name,
      phone: phone || null,
    };

    // Validasi alur perubahan kata sandi jika diisi user
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json({ message: "Kata sandi lama wajib diisi untuk verifikasi akun" }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: "Kata sandi lama yang Anda masukkan salah" }, { status: 400 });
      }

      // Enkripsi kata sandi baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Eksekusi pembaruan ke PostgreSQL Supabase
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({ message: "Profil berhasil diperbarui", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error PUT Profile:", error);
    return NextResponse.json({ message: "Gagal memperbarui profil", error }, { status: 500 });
  }
}