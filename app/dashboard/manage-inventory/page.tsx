"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  totalStock: number;
  availableStock: number;
  condition: string;
}

interface CategoryItem {
  name: string;
}

export default function ManageInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Interactive States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Toolbar Filter & Live Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  // Input State Kategori Baru
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Form States Tambah Alat Baru
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSn, setNewSn] = useState("");
  const [newStock, setNewStock] = useState(1);
  const [newCondition, setNewCondition] = useState("Baik");

  // Form States Edit Alat
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTotalStock, setEditTotalStock] = useState(1);
  const [editAvailableStock, setEditAvailableStock] = useState(1);
  const [editCondition, setEditCondition] = useState("Baik");

  // --- 1. AMBIL DATA DARI DB (INVENTARIS & KATEGORI) ---
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/inventory?search=${searchQuery}&category=${selectedCategory}`,
      );
      const data = await res.json();
      if (res.ok) setInventory(data.equipments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setNewCategory(data.categories[0].name);
          setEditCategory(data.categories[0].name);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Live Search Filter dengan Debounce 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  // --- 2. MANAGEMENT AKSI KATEGORI ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryInput }),
      });
      const data = await res.json();

      if (res.ok) {
        setNewCategoryInput("");
        fetchCategories();
      } else {
        alert(data.error || "Gagal menambah kategori.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return;

    try {
      const res = await fetch(
        `/api/categories?name=${encodeURIComponent(catName)}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (res.ok) {
        fetchCategories();
      } else {
        alert(data.error || "Gagal menghapus kategori.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. AKSI CRUD DATA BARANG ---
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi diperketat tanpa mengecek SN lagi
    if (!newName || !newCategory) {
      alert("Harap buat & pilih kategori terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // DATA ID/SN DIHAPUS DARI PAYLOAD KIRIMAN
          name: newName,
          type: newCategory,
          totalStock: Number(newStock),
          condition: newCondition,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewName("");
        setNewStock(1);
        setNewCondition("Baik");
        fetchInventory(); // Muat ulang tabel (data baru akan muncul membawa UUID otomatis dari DB)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/inventory/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          type: editCategory,
          totalStock: Number(editTotalStock),
          availableStock: Number(editAvailableStock),
          condition: editCondition,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingItem(null);
        fetchInventory();
      } else {
        alert("Gagal memperbarui data alat.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.type);
    setEditTotalStock(item.totalStock);
    setEditAvailableStock(item.availableStock);
    setEditCondition(item.condition);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus alat "${name}"?`)) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      if (res.ok) fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Dashboard Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">
            Inventory Control
          </h2>
          <p className="text-[16px] text-[#474651]">
            Kelola ketersediaan logistik dan kondisi fisik alat laboratorium
            secara real-time.
          </p>
        </div>

        {/* Kelompok Tombol Aksi - Kelola Kategori Berada di Sebelah Kiri Tambah Item */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon="category"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Kelola Kategori
          </Button>
          <Button
            variant="primary"
            icon="add"
            onClick={() => setIsModalOpen(true)}
          >
            Tambah Item Inventaris
          </Button>
        </div>
      </div>

      {/* Search and Category Filter Toolbar Component */}
      <Card
        variant="lowest"
        className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-white"
      >
        <div className="flex-1 w-full">
          <Input
            icon="search"
            placeholder="Cari Nama Alat atau Serial Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Semua Kategori">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Data Table Wrapper Container */}
      <div className="bg-white rounded-xl border border-[#c8c5d3] shadow-sm overflow-hidden">
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-[#777682]"
                  >
                    Memuat data logistik dari database...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-[#777682]"
                  >
                    Tidak ada logistik alat laboratorium ditemukan.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f8f9ff] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#1a146b]">
                          <span className="material-symbols-outlined">
                            biotech
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-[#0b1c30]">
                            {item.name}
                          </p>
                          <p className="text-[12px] text-[#777682]">
                            SN: {item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#dce9ff] rounded-full text-[12px] font-medium text-[#1a146b]">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#0b1c30] font-medium">
                      {item.totalStock} Units
                    </td>
                    <td className="px-6 py-4 font-bold text-[#4648d4]">
                      {item.availableStock} Units
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          item.condition === "Baik" ? "success" : "error"
                        }
                      >
                        {item.condition}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className="p-2 text-[#777682] hover:text-[#1a146b] hover:bg-[#eff4ff] rounded-lg"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-2 text-[#777682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
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

      {/* MODAL 1: TAMBAH ITEM INVENTARIS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#c8c5d3]">
            <div className="px-6 py-4 bg-[#eff4ff] flex justify-between items-center border-b border-[#c8c5d3]">
              <h3 className="text-[18px] font-bold text-[#1a146b]">
                Tambah Item Inventaris
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <Input
                label="Nama Alat Laboratorium"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              {/* MODIFIKASI: Input SN dihapus, grid diubah jadi full width untuk pilihan kategori */}
              <div className="w-full">
                <Select
                  label="Kategori"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
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
                  <label className="block text-[12px] font-medium text-[#474651]">
                    Kondisi Fisik
                  </label>
                  <div className="flex gap-4">
                    <label className="flex gap-1.5 text-[14px]">
                      <input
                        type="radio"
                        checked={newCondition === "Baik"}
                        onChange={() => setNewCondition("Baik")}
                      />{" "}
                      Baik
                    </label>
                    <label className="flex gap-1.5 text-[14px]">
                      <input
                        type="radio"
                        checked={newCondition === "Rusak"}
                        onChange={() => setNewCondition("Rusak")}
                      />{" "}
                      Rusak
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" type="submit">
                  Simpan Alat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ITEM INVENTARIS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#c8c5d3]">
            <div className="px-6 py-4 bg-[#eff4ff] flex justify-between items-center border-b border-[#c8c5d3]">
              <h3 className="text-[18px] font-bold text-[#1a146b]">
                Edit Data Inventaris
              </h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditItem} className="p-6 space-y-4">
              <Input
                label="Nama Alat Laboratorium"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-[#474651]">
                    Kondisi Fisik
                  </label>
                  <div className="flex gap-4 h-[38px] items-center">
                    <label className="flex gap-1.5 text-[14px]">
                      <input
                        type="radio"
                        checked={editCondition === "Baik"}
                        onChange={() => setEditCondition("Baik")}
                      />{" "}
                      Baik
                    </label>
                    <label className="flex gap-1.5 text-[14px]">
                      <input
                        type="radio"
                        checked={editCondition === "Rusak"}
                        onChange={() => setEditCondition("Rusak")}
                      />{" "}
                      Rusak
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Total Unit Stok"
                  type="number"
                  min={0}
                  required
                  value={editTotalStock}
                  onChange={(e) => setEditTotalStock(Number(e.target.value))}
                />
                <Input
                  label="Unit Tersedia (Ready)"
                  type="number"
                  min={0}
                  required
                  value={editAvailableStock}
                  onChange={(e) =>
                    setEditAvailableStock(Number(e.target.value))
                  }
                />
              </div>
              <div className="pt-4 border-t flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
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

      {/* MODAL 3: MANAGEMENT POP-UP KATEGORI */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-[#c8c5d3] overflow-hidden">
            <div className="px-6 py-4 bg-[#eff4ff] flex justify-between items-center border-b border-[#c8c5d3]">
              <div>
                <h3 className="text-[18px] font-bold text-[#1a146b]">
                  Manajemen Kategori
                </h3>
                <p className="text-[12px] text-[#474651]">
                  Tambah atau hapus filter tipe klasifikasi laboratorium.
                </p>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <form
                onSubmit={handleAddCategory}
                className="flex gap-2 items-end"
              >
                <div className="flex-1">
                  <Input
                    label="Kategori Baru"
                    placeholder="Nama Kategori..."
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                  />
                </div>
                <Button variant="primary" type="submit">
                  Tambah
                </Button>
              </form>

              <hr className="border-[#c8c5d3]/60" />

              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-[#474651] uppercase tracking-wider">
                  Daftar Kategori Aktif
                </label>
                <div className="max-h-52 overflow-y-auto border border-[#c8c5d3] rounded-lg divide-y divide-[#c8c5d3]/40">
                  {categories.length === 0 ? (
                    <p className="p-4 text-center text-[13px] text-[#777682]">
                      Belum ada kategori tersimpan.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex justify-between items-center px-4 py-2.5 hover:bg-[#f8f9ff]"
                      >
                        <span className="text-[14px] font-medium text-[#0b1c30]">
                          {cat.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="text-[#777682] hover:text-[#ba1a1a] p-1 rounded hover:bg-[#ffdad6]/40 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Selesai
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
