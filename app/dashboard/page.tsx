"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface UserSession {
  name: string;
  role: "STUDENT" | "LECTURER" | "LABSTAFF";
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal membaca session dashboard", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-[#777682]">
        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
      </div>
    );
  }

  // Jika tidak ada user login, berikan fallback peringatan keamanan
  if (!user) {
    return (
      <Card variant="elevation" className="max-w-xl mx-auto text-center py-12 border-[#ba1a1a]/20">
        <span className="material-symbols-outlined text-[#ba1a1a] text-5xl mb-4">lock</span>
        <h3 className="text-[20px] font-bold text-[#0b1c30]">Akses Ditolak</h3>
        <p className="text-[14px] text-[#474651] mt-2 mb-6">Kamu belum login ke dalam sistem. Silakan login terlebih dahulu untuk mengakses dashboard.</p>
        <Button variant="error" onClick={() => window.location.href = "/"}>Menuju Halaman Login</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 🟢 SKENARIO 1: VIEW DASHBOARD MAHASISWA (STUDENT)                          */}
      {/* ========================================================================= */}
      {user.role === "STUDENT" && (
        <>
          {/* Welcome Banner */}
          <section className="rounded-xl bg-[#312e81] h-48 flex items-center p-8 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h2 className="text-[28px] font-bold tracking-tight mb-1">Selamat datang kembali, {user.name}</h2>
              <p className="text-[16px] opacity-90 max-w-2xl">Sistem reservasi lab siap melayani kebutuhan praktikum dan penelitian mandirimu hari ini.</p>
            </div>
            <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 opacity-10 rotate-12">school</span>
          </section>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevation" className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#eff4ff] rounded-lg text-[#1a146b]">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <Badge variant="success">Aktif</Badge>
              </div>
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Reservasi Lab Saya</p>
              <h3 className="text-[36px] font-bold text-[#0b1c30] mt-1">02</h3>
              <p className="text-[14px] text-[#777682] mt-2">Lab Komputer & Informatika I</p>
            </Card>

            <Card variant="elevation" className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#eff4ff] rounded-lg text-[#1a146b]">
                  <span className="material-symbols-outlined">handyman</span>
                </div>
                <Badge variant="warning">1 Segera Kembali</Badge>
              </div>
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Alat Terpinjam</p>
              <h3 className="text-[36px] font-bold text-[#0b1c30] mt-1">03</h3>
              <p className="text-[14px] text-[#777682] mt-2">Arduino Kit, Digital Multimeter</p>
            </Card>

            <Card variant="elevation" className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">campaign</span>
                <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Pengumuman Lab</p>
              </div>
              <div className="border-l-4 border-l-[#4648d4] pl-3 py-1 bg-[#eff4ff] rounded-r-lg">
                <p className="text-[12px] font-bold text-[#1a146b]">Maintenance Lab Fisika</p>
                <p className="text-[11px] text-[#777682]">Besok, 08:00 - 12:00 WIB</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity Table Container */}
          <Card variant="elevation" className="overflow-hidden p-0">
            <div className="p-6 border-b border-[#c8c5d3]/40 flex justify-between items-center">
              <h3 className="text-[16px] font-bold text-[#0b1c30]">Aktivitas Peminjaman Terbaru</h3>
              <Button variant="outline" size="sm" icon="history" onClick={() => window.location.href = "/dashboard/history"}>Lihat Semua</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase">
                    <th className="px-6 py-3">ID Pengajuan</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Nama Layanan / Alat</th>
                    <th className="px-6 py-3">Tanggal Sesi</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c8c5d3]/20 text-[14px]">
                  <tr className="hover:bg-[#f8f9ff]">
                    <td className="px-6 py-4 font-mono font-bold text-[#1a146b]">#LAB-2026-001</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 border border-[#c8c5d3] bg-white rounded-md text-[12px]">Laboratorium</span></td>
                    <td className="px-6 py-4 font-medium">Lab Komputer & Informatika I</td>
                    <td className="px-6 py-4 text-[#474651]">24 Jun 2026, 09:00 WIB</td>
                    <td className="px-6 py-4 text-center"><Badge variant="success">Disetujui</Badge></td>
                  </tr>
                  <tr className="hover:bg-[#f8f9ff]">
                    <td className="px-6 py-4 font-mono font-bold text-[#1a146b]">#ALT-2026-042</td>
                    <td className="px-6 py-4"><span className="px-2 py-0.5 border border-[#c8c5d3] bg-white rounded-md text-[12px]">Pinjam Alat</span></td>
                    <td className="px-6 py-4 font-medium">Digital Multimeter Fluke 87V</td>
                    <td className="px-6 py-4 text-[#474651]">26 Jun 2026, 13:00 WIB</td>
                    <td className="px-6 py-4 text-center"><Badge variant="warning">Menunggu</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ========================================================================= */}
      {/* 🔵 SKENARIO 2: VIEW DASHBOARD DOSEN (LECTURER)                            */}
      {/* ========================================================================= */}
      {user.role === "LECTURER" && (
        <>
          {/* Welcome Banner */}
          <section className="rounded-xl bg-[#312e81] h-48 flex items-center p-8 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h2 className="text-[28px] font-bold tracking-tight mb-1">Selamat datang kembali, {user.name}</h2>
              <p className="text-[16px] opacity-90 max-w-2xl">Akses penjadwalan kuliah massal semesteran (*Bulk Scheduling*) dan permohonan pemindahan jadwal mandiri aktif di bawah.</p>
            </div>
            <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 opacity-10 rotate-12">workspace_premium</span>
          </section>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevation">
              <div className="p-3 bg-[#eff4ff] w-fit rounded-lg text-[#1a146b] mb-4">
                <span className="material-symbols-outlined">class</span>
              </div>
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Mata Kuliah Diampu</p>
              <h3 className="text-[36px] font-bold text-[#0b1c30] mt-1">03 Kelas</h3>
            </Card>
            <Card variant="elevation">
              <div className="p-3 bg-[#eff4ff] w-fit rounded-lg text-[#1a146b] mb-4">
                <span className="material-symbols-outlined">event_repeat</span>
              </div>
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Total Plot Sesi Semester</p>
              <h3 className="text-[36px] font-bold text-[#0b1c30] mt-1">14 Minggu</h3>
            </Card>
            <Card variant="elevation">
              <div className="p-3 bg-[#ffdad6] w-fit rounded-lg text-[#ba1a1a] mb-4">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Notifikasi Reschedule</p>
              <h3 className="text-[36px] font-bold text-[#ba1a1a] mt-1">01 Status</h3>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="elevation">
              <h4 className="text-[16px] font-bold text-[#1a146b] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">event_available</span> Aksi Cepat Dosen
              </h4>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="secondary" icon="event_repeat" onClick={() => window.location.href = "/dashboard/bulk-scheduler"}>Ajukan Jadwal Kuliah Rutin (Bulk)</Button>
                <Button className="w-full justify-start" variant="outline" icon="calendar_month" onClick={() => window.location.href = "/dashboard/reschedule"}>Ajukan Reschedule Ruangan Lab</Button>
              </div>
            </Card>
            <Card variant="elevation" className="flex flex-col justify-center bg-[#eff4ff]/40 border border-dashed border-[#c8c5d3]">
              <p className="text-[14px] font-semibold text-[#1a146b] mb-1">💡 Informasi Sistem Akademik</p>
              <p className="text-[12px] text-[#474651] leading-relaxed">Pengajuan *Bulk Scheduling* otomatis akan melakukan pengecekan tabrakan jadwal (*clash detection*) terhadap 14 agenda kelas paralel lain di database.</p>
            </Card>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 🟠 SKENARIO 3: VIEW DASHBOARD STAF LAB / ADMIN (LABSTAFF)                  */}
      {/* ========================================================================= */}
      {user.role === "LABSTAFF" && (
        <>
          {/* Welcome Header */}
          <div>
            <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">System Overview</h2>
            <p className="text-[14px] text-[#474651]">Pemantauan real-time sirkulasi logistik alat dan utilisasi operasional ruangan laboratorium.</p>
          </div>

          {/* Analytical Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="elevation" className="border-l-4 border-l-amber-500">
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Antrean Persetujuan</p>
              <h3 className="text-[36px] font-bold text-[#1a146b] mt-1">24 Berkas</h3>
              <p className="text-[11px] text-amber-600 font-bold mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">priority_high</span> 8 Prioritas Tinggi
              </p>
            </Card>

            <Card variant="elevation">
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Utilisasi Ruang Lab</p>
              <h3 className="text-[36px] font-bold text-[#1a146b] mt-1">12 / 15</h3>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#4648d4] h-full w-[80%] rounded-full"></div>
              </div>
            </Card>

            <Card variant="elevation" className="border-l-4 border-l-[#ba1a1a]">
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Alert Alat Rusak</p>
              <h3 className="text-[36px] font-bold text-[#ba1a1a] mt-1">07 Unit</h3>
              <p className="text-[11px] text-[#ba1a1a] font-medium mt-2">Butuh Kalibrasi & Restock</p>
            </Card>

            <Card variant="elevation">
              <p className="text-[#474651] text-[12px] uppercase font-bold tracking-wider">Pengguna Aktif</p>
              <h3 className="text-[36px] font-bold text-[#0b1c30] mt-1">1.2k User</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% Bulan Ini
              </p>
            </Card>
          </div>

          {/* Bento Grid: Weekly Chart & Health Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <Card variant="elevation" className="lg:col-span-2">
              <h4 className="text-[16px] font-bold text-[#1a146b] mb-6">Weekly Usage Trends (Total Jam / Hari)</h4>
              <div className="h-44 flex items-end justify-between gap-4 px-2">
                <div className="flex flex-col items-center w-full group">
                  <div className="w-full bg-[#6063ee]/20 rounded-t-md h-[40%] group-hover:bg-[#6063ee] transition-colors"></div>
                  <span className="mt-2 text-[10px] text-[#474651] font-bold">SEN</span>
                </div>
                <div className="flex flex-col items-center w-full group">
                  <div className="w-full bg-[#6063ee]/20 rounded-t-md h-[65%] group-hover:bg-[#6063ee] transition-colors"></div>
                  <span className="mt-2 text-[10px] text-[#474651] font-bold">SEL</span>
                </div>
                <div className="flex flex-col items-center w-full group">
                  <div className="w-full bg-[#6063ee]/20 rounded-t-md h-[85%] group-hover:bg-[#6063ee] transition-colors"></div>
                  <span className="mt-2 text-[10px] text-[#474651] font-bold">RAB</span>
                </div>
                <div className="flex flex-col items-center w-full group">
                  <div className="w-full bg-[#6063ee] rounded-t-md h-[100%]"></div>
                  <span className="mt-2 text-[10px] text-[#1a146b] font-bold">KAM</span>
                </div>
                <div className="flex flex-col items-center w-full group">
                  <div className="w-full bg-[#6063ee]/20 rounded-t-md h-[55%] group-hover:bg-[#6063ee] transition-colors"></div>
                  <span className="mt-2 text-[10px] text-[#474651] font-bold">JUM</span>
                </div>
              </div>
            </Card>

            {/* System Health Log */}
            <Card variant="elevation">
              <h4 className="text-[16px] font-bold text-[#1a146b] mb-4">System Log</h4>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                <div className="border-l-2 border-l-[#4648d4] pl-3 py-0.5">
                  <p className="text-[11px] font-bold text-[#474651]">10:45 WIB</p>
                  <p className="text-[13px] font-bold text-[#0b1c30]">Cloud Sync Success</p>
                  <p className="text-[11px] text-[#777682]">Backup data node Supabase berhasil.</p>
                </div>
                <div className="border-l-2 border-l-amber-500 pl-3 py-0.5">
                  <p className="text-[11px] font-bold text-[#474651]">09:12 WIB</p>
                  <p className="text-[13px] font-bold text-[#0b1c30]">Alat Warning</p>
                  <p className="text-[11px] text-[#777682]">Stof Centrifuge sisa 1 unit di rak.</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}