"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";

// Tipe Data Struktur Pengajuan
interface ApprovalRequest {
  id: string;
  name: string;
  role: "STUDENT" | "LECTURER";
  initials: string;
  date: string;
  time: string;
  location: string;
  equipment: string;
  purpose: string;
}

export default function ApprovalsPage() {
  // State untuk menyimpan daftar antrean pengajuan (Mock Data dari Stitch)
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: "REQ-90122",
      name: "Ahmad Rifqi",
      role: "STUDENT",
      initials: "AR",
      date: "24 Okt 2026",
      time: "09:00 - 13:00",
      location: "Lab Kimia Organik II (R.402)",
      equipment: "Spektrofotometer UV-Vis",
      purpose: "Analisis struktur senyawa flavonoid hasil isolasi dari ekstrak daun kemangi untuk tesis semester akhir.",
    },
    {
      id: "REQ-89410",
      name: "Dr. Dewi Wulandari",
      role: "LECTURER",
      initials: "DW",
      date: "25 Okt 2026",
      time: "08:00 - 17:00",
      location: "Lab Komputasi Lanjut (R.201)",
      equipment: "Cluster GPU Titan X (3 Units)",
      purpose: "Pelatihan model Deep Learning untuk deteksi dini penyakit tanaman berbasis citra satelit.",
    },
    {
      id: "REQ-88721",
      name: "Budi Tanoto",
      role: "STUDENT",
      initials: "BT",
      date: "26 Okt 2026",
      time: "13:00 - 15:00",
      location: "Lab Mekatronika Dasar",
      equipment: "Oskiloskop Digital, Solder Station",
      purpose: "Perbaikan modul sirkuit kendali motor brushless untuk kompetisi robotik nasional.",
    }
  ]);

  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [processedId, setProcessedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: "APPROVE" | "REJECT") => {
    setProcessedId(id);
    
    // Simulasi loading dan penghapusan item dari antrean setelah diproses
    setTimeout(() => {
      setRequests(requests.filter(req => req.id !== id));
      setProcessedId(null);
      setToastMessage(action === "APPROVE" ? "Pengajuan Berhasil Disetujui" : "Pengajuan Berhasil Ditolak");
      
      // Hilangkan toast setelah 3 detik
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h3 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Antrean Persetujuan</h3>
        <p className="text-[14px] text-[#474651] mt-1">Tinjau dan proses permohonan aktif reservasi laboratorium serta peminjaman alat.</p>
      </div>

      {/* Analytical Statistics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevation" className="border-l-4 border-l-[#1a146b]">
          <p className="text-[12px] font-medium text-[#474651] uppercase tracking-wider">Menunggu Tinjauan</p>
          <h4 className="text-[36px] font-bold text-[#1a146b] mt-1">{requests.length} Berkas</h4>
        </Card>
        <Card variant="elevation">
          <p className="text-[12px] font-medium text-[#474651] uppercase tracking-wider">Disetujui Hari Ini</p>
          <h4 className="text-[36px] font-bold text-emerald-600 mt-1">28 Sesi</h4>
        </Card>
        <Card variant="elevation">
          <p className="text-[12px] font-medium text-[#474651] uppercase tracking-wider">Ditolak Hari Ini</p>
          <h4 className="text-[36px] font-bold text-[#ba1a1a] mt-1">04 Berkas</h4>
        </Card>
        <Card variant="elevation" className="bg-[#312e81] text-white">
          <p className="text-[12px] font-medium text-[#9c9af4] uppercase tracking-wider">Waktu Respon Rata-rata</p>
          <h4 className="text-[36px] font-bold text-white mt-1">15 Menit</h4>
        </Card>
      </div>

      {/* Main Approval List Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {requests.length === 0 ? (
          <Card variant="elevation" className="col-span-2 text-center py-12 text-[#777682]">
            <span className="material-symbols-outlined text-4xl mb-2">verified_user</span>
            <p className="text-[16px] font-medium">Semua antrean bersih! Tidak ada pengajuan tertunda.</p>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} variant="elevation" className="flex flex-col gap-4 border border-[#c8c5d3]/60 hover:shadow-md transition-shadow">
              {/* Card Top Row Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#1a146b] font-bold text-[16px]">
                    {req.initials}
                  </div>
                  <div>
                    <h5 className="text-[16px] font-bold text-[#0b1c30]">{req.name}</h5>
                    <Badge variant={req.role === "LECTURER" ? "secondary" : "info"}>{req.role}</Badge>
                  </div>
                </div>
                <div className="text-right text-[12px] text-[#474651] space-y-0.5 font-medium">
                  <p className="flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {req.date}</p>
                  <p className="flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> {req.time}</p>
                </div>
              </div>

              {/* Technical Specifications Sub-Card Panel */}
              <div className="grid grid-cols-2 gap-4 bg-[#eff4ff] p-4 rounded-lg border border-[#c8c5d3]/30">
                <div>
                  <p className="text-[11px] font-semibold text-[#474651] uppercase tracking-wider">Lokasi / Ruangan</p>
                  <p className="text-[14px] font-semibold text-[#0b1c30] mt-0.5">{req.location}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#474651] uppercase tracking-wider">Logistik Alat</p>
                  <p className="text-[14px] font-semibold text-[#0b1c30] mt-0.5">{req.equipment}</p>
                </div>
                <div className="col-span-2 border-t border-[#c8c5d3]/20 pt-2">
                  <p className="text-[11px] font-semibold text-[#474651] uppercase tracking-wider">Tujuan Penggunaan</p>
                  <p className="text-[14px] text-[#0b1c30] leading-relaxed italic mt-1 font-normal">
                    "{req.purpose}"
                  </p>
                </div>
              </div>

              {/* Action Decision Form Elements */}
              <div className="space-y-3">
                <Textarea
                  label="Komentar / Alasan Keputusan Staf Lab"
                  placeholder="Tuliskan catatan revisi atau alasan persetujuan/penolakan berkas..."
                  value={notes[req.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [req.id]: e.target.value })}
                />
                
                <div className="flex gap-3">
                  <Button
                    variant="error"
                    className="flex-1 uppercase tracking-wider text-[12px]"
                    icon="block"
                    isLoading={processedId === req.id}
                    onClick={() => handleAction(req.id, "REJECT")}
                  >
                    Tolak Pengajuan
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 uppercase tracking-wider text-[12px]"
                    icon="check_circle"
                    isLoading={processedId === req.id}
                    onClick={() => handleAction(req.id, "APPROVE")}
                  >
                    Setujui Pengajuan
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Animated Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#312e81] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] transition-all border border-[#c3c0ff]/20">
          <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
          <span className="text-[14px] font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}