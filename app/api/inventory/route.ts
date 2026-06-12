import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Ambil Data + Fitur Pencarian & Filter Kategori
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "Semua Kategori";

    // Susun filter query dinamis
    const whereCondition: any = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            // Mencocokkan ID/SN karena di schema awal kolom SN dipetakan ke data String
            { id: { contains: search, mode: "insensitive" } }, 
          ],
        },
      ],
    };

    // Jika kategori dispesifikasikan (bukan Semua Kategori)
    if (category !== "Semua Kategori") {
      whereCondition.AND.push({ type: category });
    }

    const equipments = await prisma.equipment.findMany({
      where: whereCondition,
      orderBy: { name: "asc" }, // Urutkan abjad nama alat
    });

    return NextResponse.json({ equipments }, { status: 200 });
  } catch (error) {
    console.error("GET Inventory Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data inventaris" }, { status: 500 });
  }
}

// 2. POST: Tambah Item Baru ke DB (Serial Number Otomatis dari Sistem)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // PERBAIKAN: Variabel 'id' dihapus dari sini agar staf tidak perlu menginput SN manual
    const { name, type, totalStock, condition } = body; 

    if (!name || !type || !totalStock || !condition) {
      return NextResponse.json({ error: "Data formulir tidak lengkap" }, { status: 400 });
    }

    const newEquipment = await prisma.equipment.create({
      data: {
        // PERBAIKAN: Jangan sebutkan field 'id' di sini. 
        // Biarkan Prisma dan database mengeksekusi dekorator @default(uuid()) secara otomatis.
        name,
        type,
        totalStock: Number(totalStock),
        availableStock: Number(totalStock), // Stok awal tersedia disamakan dengan total stok
        condition,
      },
    });

    return NextResponse.json({ message: "Alat berhasil ditambahkan", item: newEquipment }, { status: 201 });
  } catch (error) {
    console.error("POST Inventory Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan alat baru" }, { status: 500 });
  }
}