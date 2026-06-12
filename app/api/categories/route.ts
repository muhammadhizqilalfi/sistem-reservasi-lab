import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: "Nama kosong" }, { status: 400 });
  
  const existing = await prisma.category.findUnique({ where: { name: name.trim() } });
  if (existing) return NextResponse.json({ error: "Kategori sudah ada" }, { status: 400 });

  const newCat = await prisma.category.create({ data: { name: name.trim() } });
  return NextResponse.json({ category: newCat }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Nama dibutuhkan" }, { status: 400 });

  // Cegah hapus jika kategori masih dipakai oleh alat laboratorium
  const dipakai = await prisma.equipment.count({ where: { type: name } });
  if (dipakai > 0) return NextResponse.json({ error: "Gagal! Kategori ini masih digunakan oleh alat." }, { status: 400 });

  await prisma.category.delete({ where: { name } });
  return NextResponse.json({ message: "Berhasil dihapus" });
}