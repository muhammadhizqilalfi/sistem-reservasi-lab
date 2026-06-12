"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function LecturerBulkScheduler() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Bulk Scheduling</h2>
        <p className="text-[14px] text-[#474651] mt-1">Lakukan permohonan plotting jadwal kelas praktikum kuliah berulang secara massal untuk satu semester penuh.</p>
      </div>

      {/* Stepper wizard process lines */}
      <div className="flex items-center max-w-md mx-auto py-2">
        <div className="flex flex-col items-center flex-1 text-[#1a146b]">
          <div className="w-8 h-8 rounded-full border-2 border-[#1a146b] bg-[#e2dfff] flex items-center justify-center font-bold text-[13px]">1</div>
          <span className="text-[11px] font-bold mt-1">Konfigurasi</span>
        </div>
        <div className="h-0.5 bg-[#c8c5d3] flex-1"></div>
        <div className="flex flex-col items-center flex-1 text-[#777682]">
          <div className="w-8 h-8 rounded-full border-2 border-[#c8c5d3] bg-white flex items-center justify-center font-bold text-[13px]">2</div>
          <span className="text-[11px] font-medium mt-1">Konfirmasi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Forms Inputs Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recurrence Radio Cards */}
          <Card variant="lowest" className="bg-white p-6 border border-[#c8c5d3]">
            <h4 className="text-[16px] font-bold text-[#0b1c30] mb-4">Pilih Masa Berulang (Recurrence)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="border-2 border-[#4648d4] bg-[#e1e0ff]/30 p-4 rounded-xl block cursor-pointer">
                <div className="flex justify-between items-center mb-1 text-[#1a146b]">
                  <span className="font-bold text-[16px]">14 Minggu</span>
                  <span className="material-symbols-outlined">date_range</span>
                </div>
                <p className="text-[12px] text-[#474651] leading-relaxed">Sesi praktikum rutin mingguan teratur di luar pekan UTS dan UAS.</p>
              </label>
              <label className="border-2 border-[#c8c5d3] p-4 rounded-xl block cursor-pointer hover:bg-[#f8f9ff]">
                <div className="flex justify-between items-center mb-1 text-[#474651]">
                  <span className="font-bold text-[16px]">Semester Penuh</span>
                  <span className="material-symbols-outlined">event_available</span>
                </div>
                <p className="text-[12px] text-[#777682] leading-relaxed">Mencakup total 16-18 minggu penuh termasuk pengerjaan tugas akhir.</p>
              </label>
            </div>
          </Card>

          {/* Form Meta Fields */}
          <Card variant="lowest" className="bg-white p-6 border border-[#c8c5d3] space-y-4">
            <h4 className="text-[16px] font-bold text-[#0b1c30]">Detail Informasi Akademik</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nama Mata Kuliah Praktik" defaultValue="Sistem Basis Data Terdistribusi" required />
              <Input label="Kode Seksi Kelas" placeholder="Contoh: IF-402A" required />
              <Input label="Jam Masuk Sesi" type="time" defaultValue="08:00" required />
              <Input label="Jam Selesai Sesi" type="time" defaultValue="10:30" required />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Batal</Button>
            <Button variant="primary" icon="send">Ajukan Plotting Jadwal Kuliah</Button>
          </div>
        </div>

        {/* Right Preview Snapshots Bars */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="elevation" className="bg-[#1a146b] text-white p-6">
            <h4 className="text-[12px] font-bold text-[#9c9af4] uppercase tracking-wider mb-4">Ringkasan Pilihan</h4>
            <div className="space-y-4 text-[14px]">
              <div>
                <p className="text-[11px] opacity-70 font-bold uppercase">Ruangan Target</p>
                <p className="text-[18px] font-bold flex items-center gap-1.5 mt-0.5"><span className="material-symbols-outlined text-[#c3c0ff]">business</span> Lab Komputer A</p>
              </div>
              <div className="h-[1px] bg-white/20"></div>
              <div>
                <p className="text-[11px] opacity-70 font-bold uppercase">Hari Berulang</p>
                <p className="text-[18px] font-bold flex items-center gap-1.5 mt-0.5"><span className="material-symbols-outlined text-[#c3c0ff]">calendar_today</span> Setiap Hari Senin</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}