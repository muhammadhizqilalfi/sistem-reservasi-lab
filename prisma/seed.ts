import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Memulai proses seeding data...");

  // 1. Bersihkan data lama jika ada (opsional agar tidak duplikat)
  await prisma.equipment.deleteMany({});
  await prisma.laboratory.deleteMany({});

  // 2. Tambah Data Laboratorium
  const lab1 = await prisma.laboratory.create({
    data: {
      code: "LAB-KOM-A",
      name: "Laboratorium Komputer Komputasi & Jaringan",
      location: "Gedung Kuliah 3, Lantai 2",
      capacity: 30,
    },
  });

  const lab2 = await prisma.laboratory.create({
    data: {
      code: "LAB-KOM-B",
      name: "Laboratorium Rekayasa Perangkat Lunak",
      location: "Gedung Kuliah 3, Lantai 2",
      capacity: 25,
    },
  });

  console.log("🟢 Data Laboratorium berhasil ditambahkan!");

  // 3. Tambah Data Alat Inventaris (Equipment)
  await prisma.equipment.createMany({
    data: [
      {
        name: "Router Cisco ISR 4331",
        type: "Jaringan",
        totalStock: 5,
        availableStock: 5,
        condition: "Baik",
      },
      {
        name: "MikroTik RouterBOARD RB951Ui",
        type: "Jaringan",
        totalStock: 12,
        availableStock: 12,
        condition: "Baik",
      },
      {
        name: "Modul Praktikum IoT (Arduino + Sensor)",
        type: "Elektronik",
        totalStock: 20,
        availableStock: 20,
        condition: "Baik",
      },
      {
        name: "Projector Epson X41",
        type: "Fasilitas",
        totalStock: 3,
        availableStock: 2, // Misal 1 sedang dipakai/rusak
        condition: "Baik",
      },
    ],
  });

  console.log("🟢 Data Inventaris Alat berhasil ditambahkan!");
  console.log("🚀 Proses seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });