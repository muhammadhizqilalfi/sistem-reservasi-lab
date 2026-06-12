"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

interface InventoryItem {
  id: string;
  name: string;
  sn: string;
  category: string;
  totalStock: number;
  availableStock: number;
  condition: "Baik" | "Rusak";
}

export default function ManageInventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", name: "Olympus CX23 Microscope", sn: "LAB-OP-001", category: "Mikroskop", totalStock: 12, availableStock: 8, condition: "Baik" },
    { id: "2", name: "Heraeus Multifuge X1", sn: "LAB-SF-042", category: "Sentrifugasi", totalStock: 4, availableStock: 1, condition: "Rusak" },
    { id: "3", name: "Digital Water Bath Pro", sn: "LAB-WB-099", category: "Pemanas", totalStock: 6, availableStock: 6, condition: "Baik" }
  ]);

  // Form States untuk Alat Baru
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Mikroskop");
  const [newSn, setNewSn] = useState("");
  const [newStock, setNewStock] = useState(1);
  const [newCondition, setNewCondition] = useState<"Baik" | "Rusak">("Baik");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSn) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newName,
      sn: newSn,
      category: newCategory,
      totalStock: Number(newStock),
      availableStock: Number(newStock),
      condition: newCondition
    };

    setInventory([...inventory, newItem]);
    setIsModalOpen(false);
    
    // Reset Forms
    setNewName("");
    setNewSn("");
    setNewStock(1);
    setNewCondition("Baik");
  };

  return (
    <div className="space-y-6">
      {/* Top Section Actions Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Inventory Control</h2>
          <p className="text-[16px] text-[#474651]">Kelola ketersediaan logistik dan kondisi fisik alat laboratorium secara real-time.</p>
        </div>
        <Button variant="primary" icon="add" onClick={() => setIsModalOpen(true)}>
          Tambah Item Inventaris
        </Button>
      </div>

      {/* Search and Category Filter Toolbar Component */}
      <Card variant="lowest" className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-white">
        <div className="flex-1 w-full">
          <Input icon="search" placeholder="Cari Nama Alat atau Serial Number..." />
        </div>
        <div className="w-full sm:w-64">
          <Select icon="category">
            <option>Semua Kategori</option>
            <option>Mikroskop</option>
            <option>Sentrifugasi</option>
            <option>Pemanas</option>
          </Select>
        </div>
      </Card>

      {/* High-Density Data Table Wrapper Container */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Alat</th>
                <th className="px-6 py-4">Tipe / Kategori</th>
                <th className="px-6 py-4">Total Stok</th>
                <th className="px-6 py-4">Stok Tersedia</th>
                <th className="px-6 py-4">Kondisi</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/40 text-[14px]">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#1a146b]">
                        <span className="material-symbols-outlined">biotech</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#0b1c30]">{item.name}</p>
                        <p className="text-[12px] text-[#777682]">SN: {item.sn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#dce9ff] rounded-full text-[12px] font-medium text-[#1a146b]">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#0b1c30] font-medium">{item.totalStock} Units</td>
                  <td className="px-6 py-4 font-bold text-[#4648d4]">{item.availableStock} Units</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.condition === "Baik" ? "success" : "error"}>
                      {item.condition}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-[#777682] hover:text-[#1a146b] hover:bg-[#eff4ff] rounded-lg transition-all" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-2 text-[#777682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-all" title="Hapus">
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

      {/* Modular Pop-Up Create Modal Overlay Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-[#c8c5d3]">
            {/* Modal Header Panel */}
            <div className="px-6 py-4 bg-[#eff4ff] flex justify-between items-center border-b border-[#c8c5d3]">
              <div>
                <h3 className="text-[18px] font-bold text-[#1a146b]">Tambah Item Inventaris</h3>
                <p className="text-[12px] text-[#474651]">Masukkan detail unit logistik baru ke database utama.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-[#dce9ff] text-[#474651] rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Interactive Form Block */}
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <Input
                label="Nama Alat Laboratorium"
                placeholder="Contoh: Digital Oscilloscope DS1104Z"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option>Mikroskop</option>
                  <option>Sentrifugasi</option>
                  <option>Pemanas</option>
                  <option>Elektronik</option>
                </Select>

                <Input
                  label="Serial Number / Kode"
                  placeholder="LAB-EL-X12"
                  required
                  value={newSn}
                  onChange={(e) => setNewSn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <Input
                  label="Total Stok Awal"
                  type="number"
                  min={1}
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                />

                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#474651]">Kondisi Fisik</label>
                  <div className="flex gap-4 items-center h-[38px]">
                    <label className="flex items-center gap-1.5 cursor-pointer group text-[14px]">
                      <input
                        type="radio"
                        name="cond"
                        checked={newCondition === "Baik"}
                        onChange={() => setNewCondition("Baik")}
                        className="text-[#1a146b] focus:ring-[#1a146b]"
                      />
                      <span className="group-hover:text-[#1a146b] transition-colors">Baik</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer group text-[14px]">
                      <input
                        type="radio"
                        name="cond"
                        checked={newCondition === "Rusak"}
                        onChange={() => setNewCondition("Rusak")}
                        className="text-[#1a146b] focus:ring-[#1a146b]"
                      />
                      <span className="group-hover:text-[#ba1a1a] transition-colors">Rusak</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bottom Layout Control Buttons */}
              <div className="pt-4 border-t border-[#c8c5d3]/40 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" type="submit">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}