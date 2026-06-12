// app/dashboard/history/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Struktur data riwayat personal (Dosen / Mahasiswa)
interface HistoryEvent {
  id: string;
  title: string;
  subTitle: string;
  regDate: string;
  useDate: string;
  status: "success" | "warning" | "error";
  statusText: string;
}

export default function PersonalHistoryPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setRole(parsed.role); // Membaca role 'STUDENT' atau 'LECTURER'
      } catch (e) {
        console.error("Gagal memuat session di riwayat", e);
      }
    }
  }, []);

  // Mock Data Riwayat Pengajuan Personal dari Stitch
  const historyData: HistoryEvent[] = [
    {
      id: "LAB-2024-001",
      title: "Lab Mikrobiologi Lanjut",
      subTitle: "Gedung Saintek A - Lantai 3",
      regDate: "12 Mar 2026",
      useDate: "15 Mar 2026 (08:00 - 12:00)",
      status: "success",
      statusText: "Disetujui",
    },
    {
      id: "ALT-2024-042",
      title: "Oscilloscope Tektronix TDS2024C",
      subTitle: "Lab Elektronika Dasar",
      regDate: "14 Mar 2026",
      useDate: "18-20 Mar 2026",
      status: "warning",
      statusText: "Menunggu",
    },
    {
      id: "LAB-2024-003",
      title: "Lab Kimia Organik",
      subTitle: "Gedung Saintek B - Lantai 2",
      regDate: "10 Mar 2026",
      useDate: "12 Mar 2026",
      status: "error",
      statusText: "Ditolak",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Riwayat Pengajuan</h2>
        <p className="text-[14px] text-[#474651] mt-1">
          {role === "LECTURER" 
            ? "Kelola dan pantau semua status plotting kelas serta peminjaman alat riset Anda."
            : "Kelola dan pantau semua status reservasi lab mandiri serta peminjaman alat praktikum Anda."}
        </p>
      </div>

      {/* Toolbar / Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#eff4ff] p-1 border border-[#c8c5d3]/30 rounded-xl w-full sm:w-auto">
          <button className="px-6 py-2 rounded-lg text-[12px] bg-white text-[#1a146b] shadow-sm font-bold transition-all">
            Semua
          </button>
          <button className="px-6 py-2 rounded-lg text-[12px] text-[#474651] hover:bg-white/50 transition-all">
            Reservasi Lab
          </button>
          <button className="px-6 py-2 rounded-lg text-[12px] text-[#474651] hover:bg-white/50 transition-all">
            Peminjaman Alat
          </button>
        </div>
        <div className="w-full sm:w-80">
          <Input icon="search" placeholder="Cari kode pengajuan atau nama alat..." />
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Nama Lab / Alat</th>
                <th className="px-6 py-4">Tanggal Pengajuan</th>
                <th className="px-6 py-4">Jadwal Penggunaan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {historyData.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-[#1a146b]">
                    #{log.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0b1c30]">{log.title}</span>
                      <span className="text-[12px] text-[#777682]">{log.subTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#474651]">{log.regDate}</td>
                  <td className="px-6 py-4 text-[#474651] font-medium">{log.useDate}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={log.status}>{log.statusText}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" icon={log.status === "error" ? "info" : "receipt_long"}>
                      {log.status === "error" ? "Alasan" : "Lihat Detail"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-[#f8f9ff] px-6 py-4 flex items-center justify-between border-t border-[#c8c5d3]/30 text-[12px]">
          <p className="text-[#474651]">Menampilkan 3 dari 24 riwayat pengajuan</p>
          <div className="flex gap-1.5">
            <button className="p-1.5 border border-[#c8c5d3] rounded-md hover:bg-white disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-[#1a146b] text-white font-bold rounded-md">1</button>
            <button className="px-3 py-1 border border-[#c8c5d3] rounded-md hover:bg-white">2</button>
            <button className="p-1.5 border border-[#c8c5d3] rounded-md hover:bg-white">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bento Pattern (Bottom Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevation" className="md:col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#e5eeff] rounded-xl text-[#1a146b]">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#0b1c30]">24</p>
            <p className="text-[#474651] text-[12px] font-medium">Total Pengajuan Anda</p>
          </div>
        </Card>

        <Card variant="elevation" className="md:col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#0b1c30]">3</p>
            <p className="text-[#474651] text-[12px] font-medium">Menunggu Persetujuan</p>
          </div>
        </Card>

        <Card variant="elevation" className="md:col-span-2 bg-[#1a146b] text-white flex justify-between items-center relative overflow-hidden group">
          <div className="relative z-10 space-y-2">
            <h4 className="text-[16px] font-bold">Butuh Bantuan Akademik?</h4>
            <p className="opacity-80 text-[12px] max-w-[280px]">Jika Anda mengalami kendala klaim ruangan lab atau sirkulasi pengembalian alat.</p>
            <Button variant="outline" className="bg-white text-[#1a146b] border-none hover:bg-[#eff4ff]">Hubungi Admin Lab</Button>
          </div>
          <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-105 transition-transform">
            support_agent
          </span>
        </Card>
      </div>
    </div>
  );
}