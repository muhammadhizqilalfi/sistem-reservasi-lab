// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

export async function POST(request: Request) {
  try {
    // Proteksi tambahan jika body request kosong agar tidak langsung crash 500
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Format JSON tidak valid atau request kosong" }, { status: 400 });
    }

    const { email, password } = body;

    // 1. Validasi input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // 3. Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // 4. Generate Token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Kembalikan data sukses beserta tokennya
    return NextResponse.json(
      {
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Runtime Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server internal" }, { status: 500 });
  }
}