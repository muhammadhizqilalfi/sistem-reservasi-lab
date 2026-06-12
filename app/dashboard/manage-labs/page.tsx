"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

interface LabMaster {
  code: string;
  name: string;
  location: string;
  capacity: number;
  status: "Operasional" | "Maintenance";
}

export default function ManageLabsPage() {
  const [labs, setLabs] = useState<LabMaster[]>([
    { code: "LAB-IF-01", name: "Lab Komputer & Informatika I", location: "Gedung Saintek A, Lantai 3", capacity: 40, status: "Operasional" },
    { code: "LAB-EL-04", name: "Lab Elektronika Dasar", location: "Gedung Saintek B, Lantai 2", capacity: 30, status: "Operasional" },
    { code: "LAB-FI-02", name: "Lab Fisika Lanjutan", location: "Gedung Saintek A, Lantai 1", capacity: 25, status: "Maintenance" },
    { code: "LAB-KI-09", name: "Lab Kimia Organik", location: "Gedung Saintek C, Lantai 4", capacity: 50, status: "Operasional" },
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Kelola Data Master Laboratorium</h1>
          <p className="text-[14px] text-[#474651]">Konfigurasi kapasitas, lokasi, dan status operasional ruangan laboratorium.</p>
        </div>
        <Button variant="secondary" icon="add">
          Tambah Ruang Lab
        </Button>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#1a146b]">
            <span className="material-symbols-outlined text-[28px]">meeting_room</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Total Lab</p>
            <p className="text-[20px] font-bold text-[#1a146b]">{labs.length} Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Tersedia</p>
            <p className="text-[20px] font-bold text-emerald-700">10 Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[28px]">handyman</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Maintenance</p>
            <p className="text-[20px] font-bold text-[#ba1a1a]">2 Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4648d4]">
            <span className="material-symbols-outlined text-[28px]">group</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Kapasitas Total</p>
            <p className="text-[20px] font-bold text-[#4648d4]">420 Kursi</p>
          </div>
        </Card>
      </div>

      {/* Table Data Master Layout */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden">
        <div className="p-6 border-b border-[#c8c5d3] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f8f9ff]">
          <div className="w-full sm:w-96">
            <Input icon="search" placeholder="Cari Kode atau Nama Laboratorium..." />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" icon="filter_list">Filter</Button>
            <Button variant="outline" icon="download">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Kode Lab</th>
                <th className="px-6 py-4">Nama Laboratorium</th>
                <th className="px-6 py-4">Lokasi Gedung / Lantai</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {labs.map((lab) => (
                <tr key={lab.code} className="hover:bg-[#f8f9ff] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 bg-[#e1e0ff] text-[#07006c] rounded-md font-bold text-[12px]">
                      {lab.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#0b1c30]">{lab.name}</td>
                  <td className="px-6 py-4 text-[#474651]">{lab.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#0b1c30] font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-[#474651]">event_seat</span>
                      {lab.capacity} Kursi
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={lab.status === "Operasional" ? "success" : "error"}>
                      {lab.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#777682] hover:text-[#4648d4] hover:bg-[#e5eeff] rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-2 text-[#777682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}