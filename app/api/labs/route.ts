import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. GET: Ambil Data Master Laboratory + Pencarian & Filter Status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "Semua Status";

    // Kondisi filter pencarian mencocokkan nama atau kode lab
    const whereCondition: any = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // Mengambil data dari tabel Laboratory sesuai skema kamu
    const laboratories = await prisma.laboratory.findMany({
      where: whereCondition,
      orderBy: { code: "asc" },
    });

    // Karena model Laboratory belum punya field status, kita petakan default "Operasional"
    // agar komponen Badge & Filter di frontend tidak mengalami error / crash.
    const formattedLabs = laboratories.map((lab) => ({
      id: lab.id,
      code: lab.code,
      name: lab.name,
      location: lab.location,
      capacity: lab.capacity,
      status: "Operasional", // Jika nanti kamu tambah field status di schema, ganti dengan lab.status
    }));

    // Lakukan filter status di sisi server setelah data terformat
    const finalData = status !== "Semua Status" 
      ? formattedLabs.filter(lab => lab.status === status)
      : formattedLabs;

    return NextResponse.json({ labs: finalData }, { status: 200 });
  } catch (error) {
    console.error("GET Laboratory Error:", error);
    return NextResponse.json({ error: "Gagal memuat data laboratorium" }, { status: 500 });
  }
}

// 2. POST: Tambah Ruang Laboratory Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, location, capacity } = body;

    if (!code || !name || !location || !capacity) {
      return NextResponse.json({ error: "Data formulir tidak lengkap" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Validasi duplikasi berdasarkan @unique code di skema kamu
    const existing = await prisma.laboratory.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: "Kode laboratorium sudah digunakan" }, { status: 400 });
    }

    const newLab = await prisma.laboratory.create({
      data: {
        code: cleanCode,
        name,
        location,
        capacity: Number(capacity),
      },
    });

    return NextResponse.json({ message: "Laboratorium berhasil ditambahkan", lab: newLab }, { status: 201 });
  } catch (error) {
    console.error("POST Laboratory Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan laboratorium baru" }, { status: 500 });
  }
}

// 3. PUT: Perbarui Data Laboratory Menggunakan id (UUID)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, code, name, location, capacity } = body;

    if (!id) {
      return NextResponse.json({ error: "ID laboratorium diperlukan untuk pembaruan" }, { status: 400 });
    }

    const updatedLab = await prisma.laboratory.update({
      where: { id }, // Menggunakan id UUID sebagai target pointer update
      data: {
        code: code.trim().toUpperCase(),
        name,
        location,
        capacity: Number(capacity),
      },
    });

    return NextResponse.json({ message: "Data laboratorium berhasil diperbarui", lab: updatedLab }, { status: 200 });
  } catch (error) {
    console.error("PUT Laboratory Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui data laboratorium" }, { status: 500 });
  }
}

// 4. DELETE: Hapus Ruang Laboratory Menggunakan id (UUID)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID laboratorium diperlukan" }, { status: 400 });
    }

    await prisma.laboratory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Laboratorium berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Laboratory Error:", error);
    return NextResponse.json({ error: "Gagal menghapus data laboratorium" }, { status: 500 });
  }
}