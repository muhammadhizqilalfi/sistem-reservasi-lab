"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface EquipmentItem {
  id: string;
  name: string;
  type: string; // Digunakan sebagai kategori alat
  totalStock: number;
  availableStock: number;
  condition: string;
}

interface CartItem extends EquipmentItem {
  quantity: number;
}

export default function StudentInventoryCatalog() {
  // Database & Filter States
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [returnDate, setReturnDate] = useState("");
  const [agreed, setAgreed] = useState(false);

  // --- 1. MEMUAT DATA EQUIPMENT DARI DB ---
  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/student/inventory?search=${searchQuery}&category=${selectedCategory}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Gagal mengambil data peralatan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCatalog();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory]);

  // --- 2. LOGIKA INTERAKSI KARTU PINJAMAN ---
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

  // Fungsi menambah kuantitas di Ringkasan Pinjaman
  const handleIncreaseQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((c) => {
        if (c.id === id) {
          return { ...c, quantity: c.quantity + 1 };
        }
        return c;
      })
    );
  };

  // Fungsi mengurangi kuantitas di Ringkasan Pinjaman
  const handleDecreaseQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((c) => {
          if (c.id === id) {
            return { ...c, quantity: c.quantity - 1 };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  // --- 3. LOGIKA CHECKOUT FORM PINJAMAN (POST) ---
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang pinjaman Anda masih kosong!");
    
    const hasStockError = cart.some((c) => c.quantity > c.availableStock);
    if (hasStockError) {
      return alert("Gagal mengajukan! Harap sesuaikan kembali jumlah pinjaman dengan stok tersedia.");
    }

    if (!returnDate) return alert("Silakan tentukan tanggal pengembalian alat!");
    if (!agreed) return alert("Anda harus menyetujui syarat pertanggungjawaban alat!");

    try {
      // Ambil token JWT yang disimpan saat login mahasiswa berhasil
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sesi login tidak ditemukan atau Anda belum login. Silakan login kembali.");
        return;
      }

      const res = await fetch("/api/student/inventory", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // MENGIRIMKAN TOKEN KE BACKEND AGAR BERHASIL (Mencegah 401)
        },
        body: JSON.stringify({
          returnDate,
          items: cart.map((c) => ({ id: c.id, quantity: c.quantity })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("⚠️ Pengajuan peminjaman alat berhasil dikirim ke antrean asisten lab!");
        setCart([]);
        setReturnDate("");
        setAgreed(false);
        fetchCatalog(); // Refresh stok tampilan terbaru agar sinkron dengan DB
      } else {
        alert(data.error || "Gagal memproses pengajuan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getIconName = (type: string) => {
    const cleanType = type.toLowerCase();
    if (cleanType.includes("elektronik")) return "developer_board";
    if (cleanType.includes("optik") || cleanType.includes("biotech")) return "biotech";
    if (cleanType.includes("jaringan") || cleanType.includes("net")) return "lan";
    return "tools_hardware";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Katalog Alat Laboratorium</h2>
        <p className="text-[14px] text-[#474651] mt-1">Cari dan pinjam fasilitas logistik alat laboratorium untuk kebutuhan riset akademik luar kelas.</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Side: Catalog Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {["Semua", "Elektronik", "Optik"].map((cat) => (
                <button
                  key={cat}
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

          {loading ? (
            <div className="text-center py-12 text-[#777682] text-[14px]">Memuat logistik log alat laboratorium...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-[#777682] text-[14px]">Alat tidak ditemukan dalam daftar inventaris database.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
                      <p>Stok Total: <span className="font-bold">{item.totalStock} Unit</span></p>
                      <p>Kondisi: <span className={`${item.condition.toLowerCase() === "baik" ? "text-[#4648d4]" : "text-amber-600"} font-semibold`}>{item.condition}</span></p>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon="add" 
                      disabled={item.availableStock <= 0}
                      onClick={() => handleAddToCart(item)}
                    >
                      {item.availableStock <= 0 ? "Stok Kosong" : "Tambah ke Pinjaman"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Shopping Checkout Panel */}
        <aside className="w-80 shrink-0 hidden xl:block">
          <Card variant="elevation" className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col justify-between bg-white border border-[#c8c5d3]">
            <div className="space-y-4 overflow-y-auto pr-1">
              <h3 className="text-[18px] font-bold text-[#1a146b] flex items-center gap-2 border-b border-[#c8c5d3]/30 pb-3">
                <span className="material-symbols-outlined">shopping_cart</span> Ringkasan Pinjaman
              </h3>
              
              {/* Basket Items Roll */}
              <div className="space-y-3">
                {cart.length === 0 ? (
                  <p className="text-[12px] text-[#777682] text-center py-6">Belum ada alat yang dipilih.</p>
                ) : (
                  cart.map((cartItem) => {
                    const isOutOfStock = cartItem.quantity > cartItem.availableStock;
                    
                    return (
                      <div key={cartItem.id} className="flex flex-col gap-1.5 p-2.5 bg-[#eff4ff] border border-[#c8c5d3]/30 rounded-lg">
                        <div className="flex justify-between items-center text-[13px]">
                          <div className="truncate w-36">
                            <p className="font-bold text-[#0b1c30] truncate">{cartItem.name}</p>
                            <p className="text-[11px] text-[#777682]">Tersedia: {cartItem.availableStock} u</p>
                          </div>
                          
                          {/* Stepper Controls */}
                          <div className="flex items-center gap-1 bg-white border border-[#c8c5d3]/40 rounded-md p-0.5">
                            <button
                              onClick={() => handleDecreaseQuantity(cartItem.id)}
                              className="text-[#474651] hover:bg-[#eff4ff] rounded p-0.5 flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[16px]">remove</span>
                            </button>
                            
                            <span className={`w-6 text-center font-bold text-[12px] ${isOutOfStock ? "text-[#ba1a1a]" : "text-[#1a146b]"}`}>
                              {cartItem.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleIncreaseQuantity(cartItem.id)}
                              className="text-[#474651] hover:bg-[#eff4ff] rounded p-0.5 flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                            
                            <div className="w-px h-4 bg-[#c8c5d3]/40 mx-0.5" />
                            
                            <button 
                              onClick={() => handleRemoveFromCart(cartItem.id)}
                              className="text-[#ba1a1a] p-0.5 hover:bg-[#ffdad6] rounded flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Real-time Stock Alert Message */}
                        {isOutOfStock && (
                          <div className="text-[11px] text-[#ba1a1a] font-medium bg-[#ffdad6]/60 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            Stok tidak cukup (Maks: {cartItem.availableStock})
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-[#c8c5d3]/40 pt-4 bg-white mt-4">
              <Input 
                label="Tanggal Pengembalian Alat" 
                type="date" 
                icon="calendar_today" 
                required 
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="agree" 
                  className="mt-0.5 rounded text-[#4648d4] border-[#c8c5d3]" 
                  required 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree" className="text-[11px] text-[#474651] leading-tight cursor-pointer">
                  Saya setuju untuk menjaga alat dan bertanggung jawab penuh jika terjadi kerusakan fisik.
                </label>
              </div>
              <Button 
                variant="secondary" 
                className="w-full py-3" 
                icon="send"
                disabled={cart.some((c) => c.quantity > c.availableStock)}
                onClick={handleCheckout}
              >
                Ajukan Peminjaman ({totalCartCount})
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}