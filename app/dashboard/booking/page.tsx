"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// --- Interfaces ---
interface LabDetail {
  id: string;
  name: string;
  location: string;
  capacity: number;
  facilities: string[];
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  totalStock: number;
  availableStock: number;
  condition: string;
}

interface CartItem extends EquipmentItem {
  quantity: number;
}

interface ConflictData {
  isConflict: boolean;
  message?: string;
  className?: string;
}

export default function StudentBookingPage() {
  // --- States Form Reservasi ---
  const [labs, setLabs] = useState<LabDetail[]>([]);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedLabData, setSelectedLabData] = useState<LabDetail | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [purpose, setPurpose] = useState("");
  const [isLoanChecked, setIsLoanChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State Deteksi Bentrok ---
  const [conflictData, setConflictData] = useState<ConflictData>({ isConflict: false });

  // --- States Katalog Logistik Inventaris Alat ---
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [returnDate, setReturnDate] = useState("");
  const [agreed, setAgreed] = useState(false);

  // --- 1. MEMUAT DAFTAR LAB ---
  const fetchLabsData = useCallback(async () => {
    try {
      const res = await fetch("/api/labs");
      const data = await res.json();
      if (res.ok && data.labs) {
        setLabs(data.labs);
        if (!selectedLabId && data.labs.length > 0) {
          setSelectedLabId(data.labs[0].id);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data master lab:", err);
    }
  }, [selectedLabId]);

  // Fungsi pengecekan bentrok jadwal secara real-time ke API
  const checkScheduleConflict = useCallback(async () => {
    if (!selectedLabId || !bookingDate || !startTime || !endTime) {
      setConflictData({ isConflict: false });
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        labId: selectedLabId,
        date: bookingDate,
        startTime,
        endTime,
      });

      const res = await fetch(`/api/reservations/check-conflict?${queryParams}`);
      const data = await res.json();

      if (res.ok && data.conflict) {
        setConflictData({
          isConflict: true,
          message: data.conflict.message,
          className: data.conflict.className,
        });
      } else {
        setConflictData({ isConflict: false });
      }
    } catch (err) {
      console.error("Gagal memeriksa bentrok jadwal:", err);
    }
  }, [selectedLabId, bookingDate, startTime, endTime]);

  // Handler sinkronisasi awal untuk memuat data lab master
  useEffect(() => {
    fetchLabsData();
  }, [fetchLabsData]);

  // Handler otomatis untuk memeriksa bentrok jadwal (Real-time & Auto Refresh 10 detik)
  useEffect(() => {
    // Hanya jalankan interval pengecekan jika seluruh field validasi jadwal sudah terisi
    if (selectedLabId && bookingDate && startTime && endTime) {
      checkScheduleConflict();

      const interval = setInterval(() => {
        checkScheduleConflict();
      }, 10000);

      return () => clearInterval(interval);
    } else {
      // Reset alert bentrok jika pengguna mengosongkan tanggal/waktu kembali
      setConflictData({ isConflict: false });
    }
  }, [selectedLabId, bookingDate, startTime, endTime, checkScheduleConflict]);

  // Efek sinkronisasi data detail lab terpilih untuk visual panel samping
  useEffect(() => {
    if (selectedLabId) {
      const found = labs.find((l) => l.id === selectedLabId);
      if (found) {
        setSelectedLabData(found);
      } else {
        setSelectedLabData({
          id: selectedLabId,
          name: selectedLabId === "iot" ? "Lab IoT / Robotik" : selectedLabId === "elka" ? "Lab Elektronika Dasar" : "Lab Komputer A",
          location: "Gedung A - Lantai 4",
          capacity: 40,
          facilities: ["High-end PC", "AC", "Projector"],
        });
      }
    }
  }, [selectedLabId, labs]);

  // --- 2. MEMUAT DATA INVENTARIS KATALOG ALAT ---
  const fetchCatalog = useCallback(async () => {
    try {
      setLoadingCatalog(true);
      const res = await fetch(`/api/student/inventory?search=${searchQuery}&category=${selectedCategory}`);
      const data = await res.json();
      if (res.ok && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Gagal mengambil data peralatan:", err);
    } finally {
      setLoadingCatalog(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (isLoanChecked) {
      const delayDebounce = setTimeout(() => {
        fetchCatalog();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [isLoanChecked, fetchCatalog]);

  // --- 3. LOGIKA INTERAKSI KERANJANG PINJAMAN ALAT ---
  const handleAddToCart = (item: EquipmentItem) => {
    if (item.availableStock <= 0) {
      alert("Maaf, sisa stock yang tersedia di laboratorium saat ini kosong!");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        if (existing.quantity >= item.availableStock) {
          alert(`Jumlah pinjaman tidak boleh melebihi sisa stok tersedia (${item.availableStock} unit)!`);
          return prevCart;
        }
        return prevCart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (id: string, action: "add" | "sub", max: number) => {
    setCart((prevCart) =>
      prevCart.map((c) => {
        if (c.id === id) {
          if (action === "add" && c.quantity < max) return { ...c, quantity: c.quantity + 1 };
          if (action === "sub" && c.quantity > 1) return { ...c, quantity: c.quantity - 1 };
        }
        return c;
      })
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  // --- 4. SUBMIT RESERVASI & PEMINJAMAN SEKALIGUS (POST PAYLOAD) ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (conflictData.isConflict) {
      const proceed = confirm("Jadwal bentrok terdeteksi. Apakah Anda yakin ingin tetap mengajukan? (Akan masuk ke status antrean/waiting list tergantung kebijakan lab).");
      if (!proceed) return;
    }

    if (isLoanChecked) {
      if (cart.length === 0) return alert("Keranjang pinjaman Anda masih kosong! Silakan pilih alat.");
      if (!returnDate) return alert("Silakan tentukan tanggal pengembalian alat!");
      if (!agreed) return alert("Anda harus menyetujui syarat pertanggungjawaban alat!");
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        labId: selectedLabId,
        date: bookingDate,
        startTime,
        endTime,
        purpose,
        includeLoan: isLoanChecked,
        loanDetails: isLoanChecked ? {
          returnDate,
          items: cart.map((c) => ({ id: c.id, quantity: c.quantity })),
        } : null,
      };

      // 1. AMBIL TOKEN DARI LOCALSTORAGE (Pastikan key-nya sesuai dengan saat Anda menyimpannya di proses login)
      const token = localStorage.getItem("token"); 

      // 2. KIRIM REQUEST DENGAN HEADER AUTHORIZATION
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 👈 INI YANG WAJIB ADA
        },
        body: JSON.stringify(payload),
      });

      // 3. JIKA RESPONS SERVER ERROR (gagal validasi, token salah, dll)
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Gagal memproses pengajuan reservasi.");
        return;
      }

      const data = await res.json();

      // 4. JIKA BERHASIL
      alert("🎉 Reservasi Laboratorium & Pengajuan Peminjaman Alat Berhasil Diajukan!");
      setPurpose("");
      setIsLoanChecked(false);
      setCart([]);
      setReturnDate("");
      setAgreed(false);
      setConflictData({ isConflict: false });
      
    } catch (err) {
      console.error("Terjadi error sistem pengajuan form:", err);
      alert("Terjadi kegagalan koneksi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getIconName = (type: string) => {
    const cleanType = type?.toLowerCase() || "";
    if (cleanType.includes("elektronik")) return "developer_board";
    if (cleanType.includes("optik") || cleanType.includes("biotech")) return "biotech";
    if (cleanType.includes("jaringan") || cleanType.includes("net")) return "lan";
    return "tools_hardware";
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
          
          <form className="p-6 space-y-6" onSubmit={handleFormSubmit}>
            {/* ALERT BENTROK DINAMIS */}
            {conflictData.isConflict && (
              <div className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg flex items-start gap-3 border border-[#ba1a1a]/10 animate-fade-in">
                <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
                <div className="text-[14px]">
                  <p className="font-bold">Jadwal Bentrok Terdeteksi</p>
                  <p className="opacity-90">
                    ⚠️ {conflictData.message || `Jadwal bentrok dengan kegiatan lain di laboratorium terpilih pada jam tersebut.`}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                label="Pilih Laboratorium" 
                icon="meeting_room" 
                required
                value={selectedLabId}
                onChange={(e) => setSelectedLabId(e.target.value)}
              >
                {labs.length > 0 ? (
                  labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))
                ) : (
                  <>
                    <option value="comp_a">Lab Komputer A</option>
                    <option value="iot">Lab IoT / Robotik</option>
                    <option value="elka">Lab Elektronika Dasar</option>
                  </>
                )}
              </Select>
              <Input 
                label="Tanggal Reservasi" 
                type="date" 
                icon="calendar_today" 
                required 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
              <Input 
                label="Jam Mulai" 
                type="time" 
                icon="schedule" 
                required 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input 
                label="Jam Selesai" 
                type="time" 
                icon="schedule" 
                required 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <Textarea 
              label="Keperluan (Purpose)" 
              placeholder="Jelaskan detail kegiatan penelitian atau praktikum akademik mandiri Anda..." 
              required 
              rows={3} 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

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

              {/* TAMPILAN KATALOG AKTIF */}
              {isLoanChecked && (
                <div className="mt-6 space-y-6 pt-4 border-t border-[#c8c5d3]/20">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                      {["Semua", "Elektronik", "Optik"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
                            selectedCategory === cat
                              ? "bg-[#4648d4] text-white"
                              : "bg-[#dce9ff] text-[#1a146b] font-medium hover:bg-[#c8c5d3]/50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="w-full sm:w-64">
                      <Input 
                        icon="search" 
                        placeholder="Cari alat..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {loadingCatalog ? (
                    <div className="text-center py-12 text-[#777682] text-[14px]">Memuat logistik log alat laboratorium...</div>
                  ) : items.length === 0 ? (
                    <div className="text-center py-12 text-[#777682] text-[14px]">Alat tidak ditemukan dalam daftar inventaris database.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((item) => (
                        <Card key={item.id} variant="lowest" className="p-0 overflow-hidden flex flex-col border border-[#c8c5d3]/60 shadow-sm group">
                          <div className="h-40 bg-[#e5eeff] relative overflow-hidden flex items-center justify-center text-[#1a146b]">
                            <span className="material-symbols-outlined text-5xl opacity-40">{getIconName(item.type)}</span>
                            <span className="absolute top-2 right-2">
                              <Badge variant={item.availableStock > 3 ? "success" : item.availableStock > 0 ? "warning" : "error"}>
                                {item.availableStock > 3 ? "TERSEDIA" : item.availableStock > 0 ? "STOK TIPIS" : "HABIS"}
                              </Badge>
                            </span>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="font-bold text-[16px] text-[#0b1c30] leading-tight">{item.name}</h4>
                              <p className="text-[12px] text-[#777682] mt-0.5">Kategori: {item.type}</p>
                            </div>
                            <div className="flex justify-between text-[13px] text-[#474651] border-t border-[#c8c5d3]/20 pt-2">
                              <p>Stok: <span className="font-bold">{item.availableStock}/{item.totalStock} Unit</span></p>
                              <p>Kondisi: <span className={`${item.condition.toLowerCase() === "baik" ? "text-[#4648d4]" : "text-amber-600"} font-semibold`}>{item.condition}</span></p>
                            </div>
                            
                            {cart.find((c) => c.id === item.id) ? (
                              <div className="flex items-center justify-between bg-[#eff4ff] p-1.5 rounded-lg border border-[#c8c5d3]/30">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    const currentQty = cart.find((c) => c.id === item.id)?.quantity || 0;
                                    if (currentQty <= 1) handleRemoveFromCart(item.id);
                                    else handleUpdateCartQty(item.id, "sub", item.availableStock);
                                  }}
                                  className="w-8 h-8 rounded bg-white border border-[#c8c5d3] flex items-center justify-center font-bold text-[#1a146b]"
                                >
                                  -
                                </button>
                                <span className="font-bold text-[14px] text-[#0b1c30]">
                                  {cart.find((c) => c.id === item.id)?.quantity} Tersedia
                                </span>
                                <button 
                                  type="button" 
                                  onClick={() => handleUpdateCartQty(item.id, "add", item.availableStock)}
                                  className="w-8 h-8 rounded bg-white border border-[#c8c5d3] flex items-center justify-center font-bold text-[#1a146b]"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <Button 
                                type="button"
                                variant="primary" 
                                size="sm" 
                                icon="add" 
                                disabled={item.availableStock <= 0}
                                onClick={() => handleAddToCart(item)}
                              >
                                {item.availableStock <= 0 ? "Stok Kosong" : "Tambah ke Pinjaman"}
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c8c5d3]/30">
              <Button variant="outline" type="button">Batal</Button>
              <Button variant="primary" type="submit" icon="send" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : "Ajukan Reservasi"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Sidebar Info Panel & Ringkasan */}
        <div className="space-y-6">
          {/* Info Lab Dinamis */}
          <Card variant="elevation" className="p-4 space-y-4 bg-[#d3e4fe]/30">
            <h4 className="text-[16px] font-bold text-[#1a146b]">Informasi Lab Terpilih</h4>
            <div className="h-32 bg-[#c8c5d3] rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a146b]/70 to-transparent flex items-end p-3 text-white">
                <div>
                  <p className="text-[11px] uppercase tracking-wider opacity-80">
                    {selectedLabData?.location || "Gedung A - Lantai 4"}
                  </p>
                  <p className="font-bold text-[16px]">
                    {selectedLabData?.name || "Memilih Laboratorium..."}
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-[14px] text-[#474651]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a146b] text-[18px]">groups</span> 
                Kapasitas: {selectedLabData?.capacity || 40} Orang
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a146b] text-[18px]">bolt</span> 
                Fasilitas: {selectedLabData?.facilities?.join(", ") || "High-end PC, AC, Projector"}
              </li>
            </ul>
          </Card>

          {/* ASIDE CART */}
          {isLoanChecked && (
            <Card variant="elevation" className="flex flex-col justify-between bg-white border border-[#c8c5d3] p-4 space-y-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#1a146b] flex items-center gap-2 border-b border-[#c8c5d3]/30 pb-3">
                  <span className="material-symbols-outlined">shopping_cart</span> Ringkasan Pinjaman
                </h3>
                
                <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-[12px] text-[#777682] text-center py-6">Belum ada alat yang dipilih.</p>
                  ) : (
                    cart.map((cartItem) => (
                      <div key={cartItem.id} className="p-2.5 bg-[#eff4ff] border border-[#c8c5d3]/30 rounded-lg flex justify-between items-center text-[13px]">
                        <div>
                          <p className="font-bold text-[#0b1c30] truncate w-36">{cartItem.name}</p>
                          <p className="text-[11px] text-[#777682]">Jumlah: {cartItem.quantity} Unit</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveFromCart(cartItem.id)}
                          className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6]/50 rounded"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t border-[#c8c5d3]/40 pt-4 bg-white">
                <Input 
                  label="Tanggal Pengembalian Alat" 
                  type="date" 
                  icon="calendar_today" 
                  required={isLoanChecked}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    className="mt-0.5 rounded text-[#4648d4] border-[#c8c5d3]" 
                    required={isLoanChecked}
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label htmlFor="agree" className="text-[11px] text-[#474651] leading-tight cursor-pointer">
                    Saya setuju untuk menjaga alat dan bertanggung jawab penuh jika terjadi kerusakan fisik.
                  </label>
                </div>
                <div className="text-[12px] text-center font-bold text-[#1a146b] bg-[#e5eeff] py-2 rounded">
                  {totalCartCount} Alat Siap Dilampirkan
                </div>
              </div>
            </Card>
          )}

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