"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

interface LabMaster {
  id: string; // Melacak Primary Key UUID dari DB
  code: string;
  name: string;
  location: string;
  capacity: number;
  status: "Operasional" | "Maintenance";
}

export default function ManageLabsPage() {
  const [labs, setLabs] = useState<LabMaster[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search Toolbar States
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form Field States
  const [currentId, setCurrentId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(30);
  const [status, setStatus] = useState<"Operasional" | "Maintenance">("Operasional");

  // --- 1. GET DATA MASTER FROM DB ---
  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/labs?search=${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        setLabs(data.labs);
      }
    } catch (err) {
      console.error("Gagal memuat data master lab:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLabs();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // --- 2. LOGIKA CRUD CONTROL ---
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentId("");
    setCode("");
    setName("");
    setLocation("");
    setCapacity(30);
    setStatus("Operasional");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lab: LabMaster) => {
    setIsEditMode(true);
    setCurrentId(lab.id);
    setCode(lab.code);
    setName(lab.name);
    setLocation(lab.location);
    setCapacity(lab.capacity);
    setStatus(lab.status);
    setIsModalOpen(true);
  };

  const handleSaveLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !location) return;

    const payload = isEditMode 
      ? { id: currentId, code, name, location, capacity } 
      : { code, name, location, capacity };

    try {
      const res = await fetch("/api/labs", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchLabs();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan perubahan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLab = async (id: string, labName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${labName}" permanen?`)) return;

    try {
      const res = await fetch(`/api/labs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchLabs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. EXPORT TO CSV DATA MASTER ---
  const handleExportCSV = () => {
    if (labs.length === 0) return;

    const headers = ["Kode Lab", "Nama Laboratorium", "Lokasi", "Kapasitas", "Status"];
    const rows = labs.map((lab) => [
      `"${lab.code}"`,
      `"${lab.name}"`,
      `"${lab.location}"`,
      lab.capacity,
      `"${lab.status}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Master_Laboratorium_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Kalkulasi Bento Grid Dinamis dari DB
  const totalLabs = labs.length;
  const availableLabs = labs.filter((l) => l.status === "Operasional").length;
  const maintenanceLabs = labs.filter((l) => l.status === "Maintenance").length;
  const totalSeats = labs.reduce((acc, curr) => acc + curr.capacity, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Kelola Data Master Laboratorium</h1>
          <p className="text-[14px] text-[#474651]">Konfigurasi kapasitas, lokasi, dan status operasional ruangan laboratorium.</p>
        </div>
        <Button variant="secondary" icon="add" onClick={handleOpenAddModal}>
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
            <p className="text-[20px] font-bold text-[#1a146b]">{totalLabs} Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Tersedia</p>
            <p className="text-[20px] font-bold text-emerald-700">{availableLabs} Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[28px]">handyman</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Maintenance</p>
            <p className="text-[20px] font-bold text-[#ba1a1a]">{maintenanceLabs} Ruang</p>
          </div>
        </Card>
        <Card variant="elevation" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4648d4]">
            <span className="material-symbols-outlined text-[28px]">group</span>
          </div>
          <div>
            <p className="text-[12px] text-[#474651]">Kapasitas Total</p>
            <p className="text-[20px] font-bold text-[#4648d4]">{totalSeats} Kursi</p>
          </div>
        </Card>
      </div>

      {/* Table Data Master Layout */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden">
        <div className="p-6 border-b border-[#c8c5d3] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f8f9ff]">
          <div className="w-full sm:w-96">
            <Input 
              icon="search" 
              placeholder="Cari Kode atau Nama Laboratorium..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" icon="filter_list">Filter</Button>
            <Button variant="outline" icon="download" onClick={handleExportCSV}>Export</Button>
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
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#777682]">Memuat data logistik laboratorium...</td></tr>
              ) : labs.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#777682]">Tidak ada ruang laboratorium ditemukan.</td></tr>
              ) : (
                labs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-[#f8f9ff] transition-colors">
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
                      {/* PERBAIKAN: Kelas 'opacity-0 group-hover:opacity-100' DIHAPUS agar tombol selalu muncul */}
                      <div className="flex justify-end gap-1 transition-all">
                        <button 
                          onClick={() => handleOpenEditModal(lab)}
                          className="p-2 text-[#777682] hover:text-[#4648d4] hover:bg-[#e5eeff] rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteLab(lab.id, lab.name)}
                          className="p-2 text-[#777682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DIALOG POP-UP TAMBAH & EDIT MASTER RUANG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#c8c5d3] overflow-hidden">
            <div className="px-6 py-4 bg-[#eff4ff] flex justify-between items-center border-b border-[#c8c5d3]">
              <h3 className="text-[18px] font-bold text-[#1a146b]">
                {isEditMode ? "Edit Ruang Laboratorium" : "Tambah Ruang Laboratorium"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveLab} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Input 
                    label="Kode Lab" 
                    placeholder="LAB-KOM-A" 
                    required 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    label="Nama Laboratorium" 
                    placeholder="Lab Komputer & Informatika" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
              </div>

              <Input 
                label="Lokasi Gedung / Lantai" 
                placeholder="Gedung Kuliah 3, Lantai 2" 
                required 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />

              <div className="grid grid-cols-2 gap-4 items-center">
                <Input 
                  label="Kapasitas Kursi" 
                  type="number" 
                  min={1} 
                  required 
                  value={capacity} 
                  onChange={(e) => setCapacity(Number(e.target.value))} 
                />
                
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#474651]">Status Operasional</label>
                  <div className="flex gap-4 h-[38px] items-center">
                    <label className="flex gap-1.5 text-[14px] cursor-pointer">
                      <input type="radio" name="status" checked={status === "Operasional"} onChange={() => setStatus("Operasional")} /> Operasional
                    </label>
                    <label className="flex gap-1.5 text-[14px] cursor-pointer">
                      <input type="radio" name="status" checked={status === "Maintenance"} onChange={() => setStatus("Maintenance")} /> Maintenance
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button variant="primary" type="submit">
                  {isEditMode ? "Simpan Perubahan" : "Simpan Ruangan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}