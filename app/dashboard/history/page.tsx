"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface BookingEquipmentDetail {
  id: string;
  quantity: number;
  equipment: {
    name: string;
    type: string;
  };
}

interface HistoryEvent {
  id: string;
  userId: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  lab?: {
    name: string;
    code: string;
  };
  equipments?: BookingEquipmentDetail[]; // Menyimpan daftar alat dari DB
}

export default function PersonalHistoryPage() {
  const [role, setRole] = useState<string | null>(null);
  const [rawHistory, setRawHistory] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Filter & Search
  const [activeTab, setActiveTab] = useState<"ALL" | "LAB" | "EQUIPMENT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Modal Detail
  const [selectedBooking, setSelectedBooking] = useState<HistoryEvent | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let userIdTmp: string | null = null;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setRole(parsed.role); 
        userIdTmp = parsed.id;
      } catch (e) {
        console.error("Gagal memuat session", e);
      }
    }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/reservations", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal mengambil data");
        const data: HistoryEvent[] = await res.json();
        
        // Ambil ID dari token JWT sebagai cadangan filter jika localStorage.user id tidak sinkron
        let tokenUserId: string | null = null;
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const parsedToken = JSON.parse(atob(base64));
          tokenUserId = parsedToken.id || parsedToken.userId || parsedToken.sub;
        }

        const myHistory = data.filter((item) => item.userId === userIdTmp || item.userId === tokenUserId);
        setRawHistory(myHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // --- LOGIKA FILTER & SEARCH ---
  const filteredData = rawHistory.filter((item) => {
    // 1. Filter Search Input
    const matchesSearch = 
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.lab?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filter Tab Kategori
    const hasEquipments = item.equipments && item.equipments.length > 0;
    if (activeTab === "LAB") return matchesSearch && !hasEquipments; // Hanya booking lab murni
    if (activeTab === "EQUIPMENT") return matchesSearch && hasEquipments; // Booking yang menyertakan pinjam alat

    return matchesSearch;
  });

  // --- MATRIKS / STATISTIK ---
  const totalReservations = rawHistory.length;
  const pendingCount = rawHistory.filter(item => item.status === "PENDING").length;

  const getBadgeVariant = (status: string) => {
    if (status === "APPROVED") return "success";
    if (status === "PENDING") return "warning";
    return "error";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Riwayat Pengajuan</h2>
        <p className="text-[14px] text-[#474651] mt-1">
          Pantau status peninjauan reservasi laboratorium dan peminjaman instrumen Anda.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#eff4ff] p-1 border border-[#c8c5d3]/30 rounded-xl w-full sm:w-auto">
          {/* Tombol Tab Semua */}
          <button 
            onClick={() => setActiveTab("ALL")}
            className={`px-6 py-2 rounded-lg text-[12px] font-bold transition-all ${activeTab === "ALL" ? "bg-white text-[#1a146b] shadow-sm" : "text-[#474651] hover:bg-white/50"}`}
          >
            Semua ({rawHistory.length})
          </button>
          {/* Tombol Tab Lab */}
          <button 
            onClick={() => setActiveTab("LAB")}
            className={`px-6 py-2 rounded-lg text-[12px] font-bold transition-all ${activeTab === "LAB" ? "bg-white text-[#1a146b] shadow-sm" : "text-[#474651] hover:bg-white/50"}`}
          >
            Reservasi Lab ({rawHistory.filter(i => !i.equipments?.length).length})
          </button>
          {/* Tombol Tab Alat */}
          <button 
            onClick={() => setActiveTab("EQUIPMENT")}
            className={`px-6 py-2 rounded-lg text-[12px] font-bold transition-all ${activeTab === "EQUIPMENT" ? "bg-white text-[#1a146b] shadow-sm" : "text-[#474651] hover:bg-white/50"}`}
          >
            Peminjaman Alat ({rawHistory.filter(i => i.equipments?.length).length})
          </button>
        </div>
        <div className="w-full sm:w-80">
          <Input 
            icon="search" 
            placeholder="Cari ID booking atau keperluan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase">
                <th className="px-6 py-4">ID Booking</th>
                <th className="px-6 py-4">Laboratorium / Ruangan</th>
                <th className="px-6 py-4">Waktu Pelaksanaan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#777682]">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#777682]">Tidak ada riwayat.</td></tr>
              ) : (
                filteredData.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="px-6 py-4 font-mono text-[12px] font-semibold text-[#1a146b]">
                      #{log.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0b1c30]">{log.lab?.name || "Laboratorium"}</span>
                        <span className="text-[12px] text-[#777682] line-clamp-1 italic">"{log.purpose}"</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#474651]">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDate(log.date)}</span>
                        <span className="text-[12px] text-[#777682]">{log.startTime} - {log.endTime} WIB</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={getBadgeVariant(log.status)}>{log.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* 🔥 TRIGER MODAL DETAIL SAAT DIKLIK */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon="receipt_long"
                        onClick={() => setSelectedBooking(log)}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL DETAIL (DIRENDER JIKA DATA TERPILIH) --- */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#c8c5d3] max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="bg-[#eff4ff] p-5 border-b border-[#c8c5d3] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#1a146b]">Detail Riwayat</h3>
                <p className="text-xs font-mono text-[#474651] mt-0.5">ID: #{selectedBooking.id}</p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-gray-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Konten Modal */}
            <div className="p-6 space-y-4 text-[14px]">
              <div>
                <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Laboratorium</label>
                <p className="font-bold text-[#0b1c30] text-[15px] mt-0.5">
                  {selectedBooking.lab?.name} ({selectedBooking.lab?.code})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Tanggal Pelaksanaan</label>
                  <p className="font-medium text-[#474651] mt-0.5">{formatDate(selectedBooking.date)}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Waktu / Jam</label>
                  <p className="font-medium text-[#474651] mt-0.5">{selectedBooking.startTime} - {selectedBooking.endTime} WIB</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Keperluan Penggunaan</label>
                <p className="text-[#474651] bg-[#f8f9ff] p-3 rounded-lg border border-[#c8c5d3]/30 italic mt-1">
                  "{selectedBooking.purpose}"
                </p>
              </div>

              {/* Tampilkan Bagian Ini Jika Terdapat Alat Laboratorium yang Dipinjam */}
              {selectedBooking.equipments && selectedBooking.equipments.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider block mb-1">
                    Alat yang Dipinjam
                  </label>
                  <div className="border border-[#c8c5d3]/40 rounded-xl overflow-hidden divide-y divide-[#c8c5d3]/20">
                    {selectedBooking.equipments.map((item) => (
                      <div key={item.id} className="p-2 px-3 bg-amber-50/40 flex justify-between items-center text-[13px]">
                        <span className="font-medium text-[#0b1c30]">{item.equipment.name}</span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md">
                          {item.quantity} Unit
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-[#c8c5d3]/30">
                <div>
                  <label className="text-[11px] font-bold text-[#777682] uppercase tracking-wider block">Status</label>
                  <div className="mt-1">
                    <Badge variant={getBadgeVariant(selectedBooking.status)}>{selectedBooking.status}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedBooking(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevation" className="md:col-span-1 flex flex-col justify-between">
          <div className="p-3 bg-[#e5eeff] rounded-xl text-[#1a146b] w-fit">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#0b1c30]">{totalReservations}</p>
            <p className="text-[#474651] text-[12px] font-medium">Total Pengajuan Anda</p>
          </div>
        </Card>

        <Card variant="elevation" className="md:col-span-1 flex flex-col justify-between">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 w-fit">
            <span className="material-symbols-outlined">hourglass_empty</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#0b1c30]">{pendingCount}</p>
            <p className="text-[#474651] text-[12px] font-medium">Menunggu Persetujuan</p>
          </div>
        </Card>

        <Card variant="elevation" className="md:col-span-2 bg-[#1a146b] text-white flex justify-between items-center relative overflow-hidden group">
          <div className="relative z-10 space-y-2">
            <h4 className="text-[16px] font-bold">Butuh Bantuan Akademik?</h4>
            <p className="opacity-80 text-[12px] max-w-[280px]">Jika Anda mengalami kendala klaim ruangan lab atau sirkulasi pengembalian alat.</p>
            <Button variant="outline" className="bg-white text-[#1a146b] border-none hover:bg-[#eff4ff]">Hubungi Admin Lab</Button>
          </div>
          <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform">
            support_agent
          </span>
        </Card>
      </div>
    </div>
  );
}