import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. API UNTUK HAPUS (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Gunakan Promise untuk Next.js terbaru
) {
  try {
    // WAJIB await params di Next.js terbaru
    const { id } = await params; 

    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Alat berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Inventory Error:", error);
    return NextResponse.json({ error: "Gagal menghapus alat dari database" }, { status: 500 });
  }
}

// 2. API UNTUK UPDATE / EDIT (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, totalStock, availableStock, condition } = body;

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        type,
        totalStock: Number(totalStock),
        availableStock: Number(availableStock),
        condition,
      },
    });

    return NextResponse.json({ message: "Alat berhasil diperbarui", item: updatedEquipment }, { status: 200 });
  } catch (error) {
    console.error("PUT Inventory Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data alat" }, { status: 500 });
  }
}