import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Ambil semua data user dari database
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // Kita gunakan ini untuk kolom tanggal daftar
      },
      orderBy: { createdAt: "desc" },
    });

    // Format data tanggal agar rapi saat dikirim ke frontend
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      date: new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
  }
}

// 2. DELETE: Hapus akun user berdasarkan parameter ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID user diperlukan" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Akun berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ error: "Gagal menghapus akun" }, { status: 500 });
  }
}