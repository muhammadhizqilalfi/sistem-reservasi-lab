"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function LecturerReschedulePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <nav className="flex items-center gap-1 text-[12px] text-[#474651] font-medium">
          <span>Reservasi Lab</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#1a146b] font-bold">Reschedule Request</span>
        </nav>
        <h2 className="text-[28px] font-bold text-[#0b1c30] tracking-tight">Reschedule Session</h2>
        <p className="text-[14px] text-[#474651]">Ajukan pemindahan waktu pelaksanaan praktikum. Perubahan disetujui jika slot pengganti kosong dan disetujui staf teknis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Box: Current Confirmed Target Snapshot */}
        <div className="lg:col-span-5">
          <Card variant="elevation" className="p-0 overflow-hidden bg-white border border-[#c8c5d3] sticky top-24">
            <div className="h-32 bg-[#1a146b] p-6 flex flex-col justify-between text-white relative">
              <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[10px] uppercase font-black tracking-wider w-fit">Agenda Terkonfirmasi</span>
              <h3 className="text-[18px] font-bold">Advanced Microbiology Lab</h3>
            </div>
            <div className="p-6 space-y-4 text-[14px] text-[#0b1c30]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1a146b]">room</span>
                <div><p className="text-[11px] text-[#777682] uppercase font-bold">Ruangan Asli</p><p className="font-bold">Lantai 3 - Ruang 304B</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1a146b]">calendar_today</span>
                <div><p className="text-[11px] text-[#777682] uppercase font-bold">Jadwal Tanggal</p><p className="font-bold">Kamis, 24 Oktober 2026</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#1a146b]">schedule</span>
                <div><p className="text-[11px] text-[#777682] uppercase font-bold">Alokasi Waktu</p><p className="font-bold">09:00 - 11:30 WIB</p></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Box: Change Input Request Form Fields */}
        <form className="lg:col-span-7 bg-white border border-[#c8c5d3] rounded-xl p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Permohonan Perubahan Berhasil Dikirim!"); }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#4648d4] rounded-full"></div>
            <h3 className="text-[18px] font-bold text-[#0b1c30]">Pengajuan Jadwal Baru</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Tanggal Alternatif Baru" type="date" icon="calendar_month" required />
            <Input label="Jam Pelaksanaan Baru" type="time" icon="alarm" required />
          </div>

          <Textarea label="Alasan Perubahan Jadwal Sesi" placeholder="Berikan alasan akademik resmi yang mendasari permohonan pemindahan jadwal ruang lab kuliah praktik ini..." required rows={4} />

          <div className="flex items-start gap-2.5 p-3 bg-[#eff4ff] border border-[#c8c5d3]/40 rounded-lg text-[13px] text-[#474651]">
            <input type="checkbox" id="terms" className="mt-0.5 rounded text-[#1a146b]" required />
            <label htmlFor="terms" className="cursor-pointer leading-tight">Saya memahami permohonan ini bersifat pengajuan resmi dan bersedia mengikuti opsi ruangan darurat cadangan jika terjadi tabrakan *slot*.</label>
          </div>

          <div className="space-y-2">
            <Button variant="primary" type="submit" className="w-full py-3" icon="send">Ajukan Perubahan Jadwal</Button>
            <Button variant="outline" type="button" className="w-full py-2">Batalkan dan Kembali</Button>
          </div>
        </form>
      </div>
    </div>
  );
}