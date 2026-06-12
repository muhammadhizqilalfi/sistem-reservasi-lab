// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

// Blueprint tipe data agar TypeScript tidak rewel
interface DashboardData {
  metrics: {
    totalReservasi: number;
    pendingReservasi: number;
    approvedReservasi: number;
    totalLaboratorium: number;
  };
  recentActivity: Array<{
    id: string;
    pemohon: string;
    rolePemohon: string;
    laboratorium: string;
    tujuan: string;
    tanggal: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>;
}

export default function MainDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Keamanan ekstra: Jika token hilang, tendang paksa ke root login page "/"
      if (!token || !storedUser.role) {
        window.location.href = "/";
        return;
      }

      setUserRole(storedUser.role);

      try {
        setLoading(true);
        // 🟢 MENEMBAK API BACKEND DINAMIS YANG KITA BUAT KEMARIN
        const res = await fetch("/api/dashboard/stats", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          console.error("Gagal memuat statistik dashboard:", result.message);
        }
      } catch (err) {
        console.error("Terjadi eror jaringan saat memuat dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#777682] gap-2">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#1a146b]">progress_activity</span>
        <p className="font-semibold text-[14px]">Menghubungkan data portal akademik...</p>
      </div>
    );
  }

  // Fallback pengaman jika data gagal ter-load
  const metrics = data?.metrics || { totalReservasi: 0, pendingReservasi: 0, approvedReservasi: 0, totalLaboratorium: 0 };
  const activities = data?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* 1. WELCOME BANNER HEADER */}
      <div className="space-y-1">
        <h2 className="text-[28px] font-bold text-[#0b1c30] tracking-tight">
          Selamat Datang Kembali di LabReserve
        </h2>
        <p className="text-[14px] text-[#474651]">
          {userRole === "LABSTAFF" 
            ? "Mode Admin Aktif: Pantau seluruh matriks pemakaian fasilitas laboratorium universitas terpusat." 
            : "Kelola pengajuan reservasi ruangan praktikum dan pinjam logistik penunjang riset akademik Anda."}
        </p>
      </div>

      {/* 2. GRID METRICS CARD (ANGKA RIIL DARI SUPABASE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Pengajuan */}
        <Card variant="elevation" className="p-6 bg-white border border-[#c8c5d3] flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#eff4ff] rounded-xl text-[#1a146b]">
            <span className="material-symbols-outlined text-3xl">analytics</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#777682] uppercase tracking-wider">Total Pengajuan</p>
            <h3 className="text-[28px] font-black text-[#0b1c30] mt-0.5">{metrics.totalReservasi}</h3>
          </div>
        </Card>

        {/* Card 2: Menunggu Konfirmasi */}
        <Card variant="elevation" className="p-6 bg-white border border-[#c8c5d3] flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#fff1e6] rounded-xl text-[#b76e00]">
            <span className="material-symbols-outlined text-3xl">pending_actions</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#777682] uppercase tracking-wider">Menunggu</p>
            <h3 className="text-[28px] font-black text-[#0b1c30] mt-0.5">{metrics.pendingReservasi}</h3>
          </div>
        </Card>

        {/* Card 3: Berhasil Disetujui */}
        <Card variant="elevation" className="p-6 bg-white border border-[#c8c5d3] flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#e6f4ea] rounded-xl text-[#137333]">
            <span className="material-symbols-outlined text-3xl">task_alt</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#777682] uppercase tracking-wider">Disetujui</p>
            <h3 className="text-[28px] font-black text-[#0b1c30] mt-0.5">{metrics.approvedReservasi}</h3>
          </div>
        </Card>

        {/* Card 4: Total Lab Kampus */}
        <Card variant="elevation" className="p-6 bg-white border border-[#c8c5d3] flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-[#f3e8ff] rounded-xl text-[#6b21a8]">
            <span className="material-symbols-outlined text-3xl">science</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#777682] uppercase tracking-wider">Total Ruang Lab</p>
            <h3 className="text-[28px] font-black text-[#0b1c30] mt-0.5">{metrics.totalLaboratorium}</h3>
          </div>
        </Card>
      </div>

      {/* 3. BENTO BOX: AKTIVITAS RESERVASI TERBARU */}
      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c8c5d3]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1a146b]">history</span>
            <h4 className="text-[16px] font-bold text-[#0b1c30]">Log Aktivitas Reservasi Terbaru</h4>
          </div>
          <span className="text-[12px] font-bold text-white bg-[#312e81] px-2.5 py-1 rounded-md uppercase tracking-wide">
            Live Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3.5">Pemohon</th>
                <th className="px-6 py-3.5">Laboratorium</th>
                <th className="px-6 py-3.5">Tujuan Praktikum</th>
                <th className="px-6 py-3.5">Jadwal Pelaksanaan</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[13px] text-[#0b1c30]">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#777682] font-medium">
                    Belum ada rekaman log aktivitas transaksi reservasi masuk.
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#f8f9ff]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold">
                      <p>{act.pemohon}</p>
                      <span className="text-[10px] text-[#777682] uppercase font-bold tracking-tight">
                        {act.rolePemohon === "LECTURER" ? "👨‍🏫 Dosen" : "👨‍🎓 Mhs"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#1a146b] font-bold">{act.laboratorium}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={act.tujuan}>{act.tujuan}</td>
                    <td className="px-6 py-4 font-medium">
                      {new Date(act.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        act.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        act.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {act.status === "APPROVED" ? "Disetujui" : act.status === "PENDING" ? "Menunggu" : "Ditolak"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}