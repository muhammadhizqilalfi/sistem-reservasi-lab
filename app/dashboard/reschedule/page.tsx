// app/dashboard/reschedule/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface ActiveBooking {
  id: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  laboratory: {
    name: string;
    location: string;
  };
}

export default function LecturerReschedulePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // States data booking aktif
  const [myBookings, setMyBookings] = useState<ActiveBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<ActiveBooking | null>(null);

  // States Form Input
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("08:00");
  const [newEndTime, setNewEndTime] = useState("10:00");
  const [reason, setReason] = useState("");

  // --- 1. LOAD JADWAL DOSEN YANG BERSTATUS APPROVED ---
  const loadLecturerBookings = async () => {
    if (typeof window === "undefined") return;
    
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    // 🟢 AMBIL TOKEN LOGIN
    const token = localStorage.getItem("token"); 

    if (!storedUser.id) return;

    try {
      setLoading(true);
      // 🟢 REVISI: Tambahkan header Authorization Bearer Token agar lolos validasi 401
      const res = await fetch(`/api/reservations?userId=${storedUser.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();

      if (res.ok) {
        const approvedOnly = data.filter((b: any) => b.status === "APPROVED");
        setMyBookings(approvedOnly);

        if (approvedOnly.length > 0) {
          setSelectedBookingId(approvedOnly[0].id);
          setSelectedBooking(approvedOnly[0]);
        }
      } else {
        console.error("Gagal memuat jadwal:", data.message);
      }
    } catch (err) {
      console.error("Gagal memuat jadwal mengajar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturerBookings();
  }, []);

  // --- 2. LOGIKA PERUBAHAN DROPDOWN JADWAL ---
  const handleSelectChange = (id: string) => {
    setSelectedBookingId(id);
    const target = myBookings.find((b) => b.id === id) || null;
    setSelectedBooking(target);
  };

  // --- 3. KIRIM PERMOHONAN KE BACKEND ---
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !newDate || !reason) {
      alert("Harap lengkapi seluruh data formulir pengajuan!");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token"); // 🟢 AMBIL TOKEN UNTUK PUT REQUEST

      const payload = {
        bookingId: selectedBookingId,
        newDate,
        newStartTime,
        newEndTime,
        reason,
      };

      // 🟢 REVISI: Pasang Authorization Token juga di sini demi keamanan
      const res = await fetch("/api/reservations/reschedule", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Permohonan reschedule berhasil diajukan! Jadwal masuk kembali ke antrean konfirmasi admin.");
        setReason("");
        setNewDate("");
        loadLecturerBookings();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal memproses pengajuan reschedule.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-[#777682]">Sinkronisasi jadwal mengajar Anda...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header Navigasi */}
      <div className="space-y-1">
        <nav className="flex items-center gap-1 text-[12px] text-[#474651] font-medium">
          <span>Reservasi Lab</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#1a146b] font-bold">Reschedule Request</span>
        </nav>
        <h2 className="text-[28px] font-bold text-[#0b1c30] tracking-tight">Reschedule Session</h2>
        <p className="text-[14px] text-[#474651]">Ajukan pemindahan waktu pelaksanaan praktikum. Perubahan disetujui jika slot pengganti kosong dan disetujui staf teknis.</p>
      </div>

      {myBookings.length === 0 ? (
        <Card variant="elevation" className="text-center py-12 text-[#777682]">
          <span className="material-symbols-outlined text-4xl mb-2">calendar_today</span>
          <p className="text-[16px] font-medium">Anda tidak memiliki jadwal kelas praktikum aktif yang berstatus disetujui (APPROVED).</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Dropdown Selector */}
          <div className="max-w-md bg-[#eff4ff] p-4 rounded-xl border border-[#c8c5d3]/40">
            <Select 
              label="Pilih Sesi Praktikum yang Ingin Di-reschedule" 
              value={selectedBookingId} 
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              {myBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.purpose.split("[MOHON")[0]} ({new Date(b.date).toLocaleDateString("id-ID")})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Snapshot Detail Sesi */}
            <div className="lg:col-span-5">
              <Card variant="elevation" className="p-0 overflow-hidden bg-white border border-[#c8c5d3] sticky top-24">
                <div className="h-32 bg-[#1a146b] p-6 flex flex-col justify-between text-white relative">
                  <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[10px] uppercase font-black tracking-wider w-fit">Agenda Terkonfirmasi</span>
                  <h3 className="text-[18px] font-bold truncate">
                    {selectedBooking ? selectedBooking.purpose.split("[MOHON")[0] : "Advanced Microbiology Lab"}
                  </h3>
                </div>
                <div className="p-6 space-y-4 text-[14px] text-[#0b1c30]">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#1a146b]">room</span>
                    <div>
                      <p className="text-[11px] text-[#777682] uppercase font-bold">Ruangan Asli</p>
                      <p className="font-bold">
                        {selectedBooking ? `${selectedBooking.laboratory?.location} - ${selectedBooking.laboratory?.name}` : "Lantai 3 - Ruang 304B"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#1a146b]">calendar_today</span>
                    <div>
                      <p className="text-[11px] text-[#777682] uppercase font-bold">Jadwal Tanggal</p>
                      <p className="font-bold">
                        {selectedBooking 
                          ? new Date(selectedBooking.date).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) 
                          : "Kamis, 24 Oktober 2026"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#1a146b]">schedule</span>
                    <div>
                      <p className="text-[11px] text-[#777682] uppercase font-bold">Alokasi Waktu</p>
                      <p className="font-bold">
                        {selectedBooking ? `${selectedBooking.startTime} - ${selectedBooking.endTime} WIB` : "09:00 - 11:30 WIB"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Box: Form Request */}
            <form className="lg:col-span-7 bg-white border border-[#c8c5d3] rounded-xl p-6 space-y-6" onSubmit={handleRescheduleSubmit}>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#4648d4] rounded-full"></div>
                <h3 className="text-[18px] font-bold text-[#0b1c30]">Pengajuan Jadwal Baru</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="Tanggal Alternatif Baru" 
                  type="date" 
                  icon="calendar_month" 
                  required 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)} 
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    label="Jam Mulai" 
                    type="time" 
                    icon="alarm" 
                    required 
                    value={newStartTime} 
                    onChange={(e) => setNewStartTime(e.target.value)} 
                  />
                  <Input 
                    label="Jam Selesai" 
                    type="time" 
                    icon="alarm" 
                    required 
                    value={newEndTime} 
                    onChange={(e) => setNewEndTime(e.target.value)} 
                  />
                </div>
              </div>

              <Textarea 
                label="Alasan Perubahan Jadwal Sesi" 
                placeholder="Berikan alasan akademik resmi yang mendasari permohonan pemindahan jadwal ruang lab kuliah praktik ini..." 
                required 
                rows={4} 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
              />

              <div className="flex items-start gap-2.5 p-3 bg-[#eff4ff] border border-[#c8c5d3]/40 rounded-lg text-[13px] text-[#474651]">
                <input type="checkbox" id="terms" className="mt-0.5 rounded text-[#1a146b]" required />
                <label htmlFor="terms" className="cursor-pointer leading-tight">Saya memahami permohonan ini bersifat pengajuan resmi dan bersedia mengikuti opsi ruangan darurat cadangan jika terjadi tabrakan *slot*.</label>
              </div>

              <div className="space-y-2">
                <Button variant="primary" type="submit" className="w-full py-3" icon="send" isLoading={submitting}>
                  Ajukan Perubahan Jadwal
                </Button>
                <Button variant="outline" type="button" className="w-full py-2" onClick={() => window.location.reload()}>
                  Batalkan dan Kembali
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}