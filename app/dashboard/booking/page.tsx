"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function StudentBookingPage() {
  const [isLoanChecked, setIsLoanChecked] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({ osc: 1, ard: 0 });

  const updateQty = (key: string, action: "add" | "sub", max: number) => {
    const current = quantities[key] || 0;
    if (action === "add" && current < max) {
      setQuantities({ ...quantities, [key]: current + 1 });
    } else if (action === "sub" && current > 0) {
      setQuantities({ ...quantities, [key]: current - 1 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="space-y-2">
        <nav className="flex items-center gap-1.5 text-[12px] text-[#474651] font-medium">
          <span>Reservasi</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#1a146b] font-bold">Formulir Pengajuan</span>
        </nav>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Formulir Pengajuan Reservasi Laboratorium</h2>
        <p className="text-[14px] text-[#474651]">Lengkapi detail di bawah untuk memesan slot praktikum atau penelitian mandiri.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Form Block */}
        <Card variant="lowest" className="lg:col-span-2 p-0 overflow-hidden shadow-sm">
          <div className="p-4 bg-[#e5eeff] border-b border-[#c8c5d3] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1a146b]">edit_note</span>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Detail Sesi Reservasi</h3>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Reservasi Berhasil Diajukan!"); }}>
            {/* Alert Conflict Simulator */}
            <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg flex items-start gap-3 border border-[#ba1a1a]/10">
              <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
              <div className="text-[14px]">
                <p className="font-bold">Jadwal Bentrok Terdeteksi</p>
                <p className="opacity-90">⚠️ Jadwal bentrok dengan kelas Praktikum Jaringan di Lab Komputer A pada pukul 14:00 - 16:00.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Pilih Laboratorium" icon="meeting_room" required>
                <option>Lab Komputer A</option>
                <option>Lab IoT / Robotik</option>
                <option>Lab Elektronika Dasar</option>
              </Select>
              <Input label="Tanggal Reservasi" type="date" icon="calendar_today" required />
              <Input label="Jam Mulai" type="time" icon="schedule" defaultValue="08:00" required />
              <Input label="Jam Selesai" type="time" icon="schedule" defaultValue="10:00" required />
            </div>

            <Textarea label="Keperluan (Purpose)" placeholder="Jelaskan detail kegiatan penelitian atau praktikum akademik mandiri Anda..." required rows={3} />

            {/* Checkbox Toggle Pengadaan Alat */}
            <div className="pt-4 border-t border-[#c8c5d3]/40">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  checked={isLoanChecked} 
                  onChange={(e) => setIsLoanChecked(e.target.checked)}
                  className="w-5 h-5 text-[#1a146b] border-[#c8c5d3] rounded focus:ring-[#1a146b]" 
                />
                <span className="text-[16px] font-bold text-[#0b1c30] group-hover:text-[#4648d4] transition-colors">Sekaligus Pinjam Alat Lab?</span>
              </label>

              {isLoanChecked && (
                <div className="mt-4 bg-[#eff4ff] border border-[#c8c5d3]/50 rounded-lg overflow-hidden animate-fadeIn">
                  <table className="w-full text-left text-[14px]">
                    <thead className="bg-[#dce9ff] text-[#474651] font-bold text-[12px] uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Nama Alat</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-center">Jumlah Pinjam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c8c5d3]/20">
                      <tr>
                        <td className="px-4 py-3 font-medium">Digital Oscilloscope DS1104Z</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">Tersedia (5)</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <button type="button" onClick={() => updateQty("osc", "sub", 5)} className="w-7 h-7 rounded border border-[#c8c5d3] hover:bg-white flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                            <span className="font-bold w-4 text-center">{quantities.osc}</span>
                            <button type="button" onClick={() => updateQty("osc", "add", 5)} className="w-7 h-7 rounded border border-[#c8c5d3] hover:bg-white flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">add</span></button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Arduino Starter Kit v3</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">Tersedia (12)</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <button type="button" onClick={() => updateQty("ard", "sub", 12)} className="w-7 h-7 rounded border border-[#c8c5d3] hover:bg-white flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                            <span className="font-bold w-4 text-center">{quantities.ard}</span>
                            <button type="button" onClick={() => updateQty("ard", "add", 12)} className="w-7 h-7 rounded border border-[#c8c5d3] hover:bg-white flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">add</span></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c8c5d3]/30">
              <Button variant="outline" type="button">Batal</Button>
              <Button variant="primary" type="submit" icon="send">Ajukan Reservasi</Button>
            </div>
          </form>
        </Card>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          <Card variant="elevation" className="p-4 space-y-4 bg-[#d3e4fe]/30">
            <h4 className="text-[16px] font-bold text-[#1a146b]">Informasi Lab Terpilih</h4>
            <div className="h-32 bg-[#c8c5d3] rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a146b]/70 to-transparent flex items-end p-3 text-white">
                <div>
                  <p className="text-[11px] uppercase tracking-wider opacity-80">Gedung A - Lantai 4</p>
                  <p className="font-bold text-[16px]">Lab Komputer A</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-[14px] text-[#474651]">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#1a146b] text-[18px]">groups</span> Kapasitas: 40 Orang</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#1a146b] text-[18px]">bolt</span> Fasilitas: High-end PC, AC, Projector</li>
            </ul>
          </Card>

          <Card variant="lowest" className="space-y-3 bg-white border border-[#c8c5d3]">
            <h4 className="text-[16px] font-bold text-[#0b1c30]">Ketentuan Utama</h4>
            <div className="space-y-2 text-[13px] text-[#474651]">
              <p className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Reservasi maksimal dilakukan H-2 sebelum kegiatan.</p>
              <p className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span> Kerusakan alat akibat kelalaian menjadi tanggung jawab penuh peminjam.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}