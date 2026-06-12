// app/dashboard/approvals/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

interface Reservation {
  id: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: {
    name: string;
    role: string;
    email: string;
  };
  laboratory: {
    name: string;
    location: string;
  };
}

export default function LabStaffApprovalsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // States untuk Modal Alasan Penolakan
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // --- 1. LOAD SEMUA ANTREAN RESERVASI (PENDING UTAMA) ---
  const loadApprovalsQueue = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      // Memanggil API utama reservasi (Backend akan memfilter seluruh data jika tokennya Admin)
      const res = await fetch("/api/reservations", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        // Urutkan agar status PENDING berada di baris paling atas
        const sortedData = data.sort((a: any, b: any) => {
          if (a.status === "PENDING" && b.status !== "PENDING") return -1;
          if (a.status !== "PENDING" && b.status === "PENDING") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setReservations(sortedData);
      } else {
        console.error("Gagal memuat antrean persetujuan:", data.message);
      }
    } catch (err) {
      console.error("Error network:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovalsQueue();
  }, []);

  // --- 2. FUNGSI APPROVE (MENYETUJUI BERKAS) ---
  const handleApprove = async (bookingId: string) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin MENYETUJUI permohonan reservasi lab ini?");
    if (!konfirmasi) return;

    try {
      setSubmittingId(bookingId);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/reservations/approval", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status: "APPROVED",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Berkas reservasi berhasil disetujui!");
        loadApprovalsQueue(); // Refresh data tabel
      } else {
        alert(data.message || "Gagal menyetujui berkas.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmittingId(null);
    }
  };

  // --- 3. FUNGSI REJECT (MEMBUKA MODAL TOLAK BERKAS) ---
  const handleOpenRejectModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // --- 4. EKSEKUSI PENOLAKAN DENGAN ALASAN NYATA ---
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi!");
      return;
    }

    try {
      setSubmittingId(selectedBookingId);
      setShowRejectModal(false);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/reservations/approval", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          status: "REJECTED",
          rejectReason: rejectReason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Berkas permohonan resmi ditolak.");
        loadApprovalsQueue();
      } else {
        alert(data.message || "Gagal menolak berkas.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="space-y-1">
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Antrean Persetujuan Dokumen</h2>
        <p className="text-[14px] text-[#474651]">Validasi berkas masuk peminjaman ruangan laboratorium dan sirkulasi alat logistik mahasiswa maupun dosen.</p>
      </div>

      {/* Konten Utama Tabel */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Pemohon</th>
                <th className="px-6 py-4">Lab & Tujuan</th>
                <th className="px-6 py-4">Alokasi Waktu</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Tindakan Modifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#777682]">
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Sinkronisasi berkas antrean Supabase...
                    </div>
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#777682]">
                    <span className="material-symbols-outlined text-3xl mb-1 text-[#c8c5d3]">checklist</span>
                    <p className="font-medium">Bersih! Tidak ada berkas antrean masuk saat ini.</p>
                  </td>
                </tr>
              ) : (
                reservations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                    {/* Kolom Pemohon */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0b1c30]">{item.user?.name || "User Luar"}</p>
                      <p className="text-[11px] text-white bg-[#312e81] font-bold px-2 py-0.5 rounded-full w-fit uppercase tracking-wider mt-1 scale-90 -ml-1">
                        {item.user?.role === "LECTURER" ? "Dosen" : item.user?.role === "STUDENT" ? "Mahasiswa" : "Peneliti"}
                      </p>
                    </td>

                    {/* Kolom Lab & Tujuan */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-[#1a146b]">{item.laboratory?.name}</p>
                      <p className="text-[13px] text-[#474651] line-clamp-2 mt-0.5" title={item.purpose}>
                        {item.purpose}
                      </p>
                    </td>

                    {/* Kolom Waktu */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0b1c30]">
                        {new Date(item.date).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[12px] text-[#777682] font-medium">{item.startTime} - {item.endTime} WIB</p>
                    </td>

                    {/* Kolom Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <Badge variant={item.status === "APPROVED" ? "success" : item.status === "PENDING" ? "warning" : "error"}>
                        {item.status === "APPROVED" ? "Disetujui" : item.status === "PENDING" ? "Menunggu" : "Ditolak"}
                      </Badge>
                    </td>

                    {/* Kolom Tombol Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "PENDING" ? (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              icon="check"
                              isLoading={submittingId === item.id}
                              onClick={() => handleApprove(item.id)}
                            >
                              Setuju
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[#ba1a1a] border-[#ba1a1a] hover:bg-[#ffdad6]/40"
                              icon="close"
                              disabled={submittingId === item.id}
                              onClick={() => handleOpenRejectModal(item.id)}
                            >
                              Tolak
                            </Button>
                          </>
                        ) : (
                          <span className="text-[12px] font-medium text-[#777682] bg-[#eff4ff] px-2 py-1 rounded border border-[#c8c5d3]/40">
                            Selesai Diproses
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🟢 FLOATING MODAL OVERLAY: ALASAN PENOLAKAN BERKAS                          */}
      {/* ========================================================================= */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <Card variant="elevation" className="w-full max-w-md bg-white p-6 rounded-xl border border-[#c8c5d3] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined font-bold">warning</span>
              <h3 className="text-[18px] font-bold">Konfirmasi Penolakan</h3>
            </div>
            
            <p className="text-[13px] text-[#474651] leading-relaxed">
              Berikan catatan alasan resmi penolakan berkas ini agar pemohon (Mahasiswa/Dosen) menerima transparansi informasi pembatalan slot.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <Textarea 
                label="Alasan Penolakan Kategori Resmi"
                placeholder="Contoh: Maaf, ruangan pada jam tersebut akan digunakan untuk Ujian Tengah Semester (UTS) Fakultas..."
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-[#c8c5d3]/30">
                <Button variant="outline" type="button" onClick={() => setShowRejectModal(false)}>
                  Kembali
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="bg-[#ba1a1a] hover:bg-[#93000a] text-white border-transparent"
                >
                  Tolak Berkas Pengajuan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}