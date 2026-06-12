import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const allowedRoles = ["STUDENT", "LECTURER", "LABSTAFF"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, role } = body;

    // 1. Validasi input wajib
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap. Pastikan nama, email, password, dan role terisi." },
        { status: 400 }
      );
    }

    // 2. Validasi apakah role yang dikirim valid sesuai schema Prisma
    const upperRole = role.toUpperCase();
    if (!allowedRoles.includes(upperRole as typeof allowedRoles[number])) {
      return NextResponse.json(
        { error: `Peran (role) '${role}' tidak valid di dalam sistem.` },
        { status: 400 }
      );
    }

    // 3. Cek apakah email sudah terdaftar sebelumnya
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // 4. Enkripsi password menggunakan bcryptjs sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan data user baru ke database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: upperRole as typeof allowedRoles[number],
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Runtime Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server internal" },
      { status: 500 }
    );
  }
}