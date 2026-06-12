"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function StudentInventoryCatalog() {
  const [cartCount, setCartCount] = useState(2);

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
              <button className="px-4 py-1.5 bg-[#4648d4] text-white rounded-full text-[12px] font-bold">Semua</button>
              <button className="px-4 py-1.5 bg-[#dce9ff] text-[#1a146b] rounded-full text-[12px] font-medium hover:bg-[#c8c5d3]/50">Elektronika</button>
              <button className="px-4 py-1.5 bg-[#dce9ff] text-[#1a146b] rounded-full text-[12px] font-medium hover:bg-[#c8c5d3]/50">Optik</button>
            </div>
            <div className="w-full sm:w-64">
              <Input icon="search" placeholder="Cari alat..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {/* Item Card 1 */}
            <Card variant="lowest" className="p-0 overflow-hidden flex flex-col border border-[#c8c5d3]/60 shadow-sm group">
              <div className="h-40 bg-[#e5eeff] relative overflow-hidden flex items-center justify-center text-[#1a146b]">
                <span className="material-symbols-outlined text-5xl opacity-40">developer_board</span>
                <span className="absolute top-2 right-2"><Badge variant="success">TERSEDIA</Badge></span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-[16px] text-[#0b1c30] leading-tight">Oscilloscope Tektronix TDS2000</h4>
                  <p className="text-[12px] text-[#777682] mt-0.5">Kategori: Elektronika</p>
                </div>
                <div className="flex justify-between text-[13px] text-[#474651] border-t border-[#c8c5d3]/20 pt-2">
                  <p>Stok Total: <span className="font-bold">12 Unit</span></p>
                  <p>Kondisi: <span className="text-[#4648d4] font-semibold">Baik</span></p>
                </div>
                <Button variant="primary" size="sm" icon="add" onClick={() => setCartCount(cartCount + 1)}>Tambah ke Pinjaman</Button>
              </div>
            </Card>

            {/* Item Card 2 */}
            <Card variant="lowest" className="p-0 overflow-hidden flex flex-col border border-[#c8c5d3]/60 shadow-sm group">
              <div className="h-40 bg-[#e5eeff] relative overflow-hidden flex items-center justify-center text-[#1a146b]">
                <span className="material-symbols-outlined text-5xl opacity-40">biotech</span>
                <span className="absolute top-2 right-2"><Badge variant="warning">STOK TIPIS</Badge></span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-[16px] text-[#0b1c30] leading-tight">Microscope Nikon Eclipse</h4>
                  <p className="text-[12px] text-[#777682] mt-0.5">Kategori: Optik</p>
                </div>
                <div className="flex justify-between text-[13px] text-[#474651] border-t border-[#c8c5d3]/20 pt-2">
                  <p>Stok Total: <span className="font-bold">5 Unit</span></p>
                  <p>Kondisi: <span className="text-amber-600 font-semibold">Kalibrasi</span></p>
                </div>
                <Button variant="primary" size="sm" icon="add" onClick={() => setCartCount(cartCount + 1)}>Tambah ke Pinjaman</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Side: Shopping Checkout Panel */}
        <aside className="w-80 shrink-0 hidden xl:block">
          <Card variant="elevation" className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col justify-between bg-white border border-[#c8c5d3]">
            <div className="space-y-4 overflow-y-auto pr-1">
              <h3 className="text-[18px] font-bold text-[#1a146b] flex items-center gap-2 border-b border-[#c8c5d3]/30 pb-3">
                <span className="material-symbols-outlined">shopping_cart</span> Ringkasan Pinjaman
              </h3>
              
              {/* Basket Items Roll */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#eff4ff] border border-[#c8c5d3]/30 rounded-lg flex justify-between items-center text-[13px]">
                  <div>
                    <p className="font-bold text-[#0b1c30] truncate w-44">Oscilloscope Tektronix</p>
                    <p className="text-[11px] text-[#777682]">Jumlah: 1 Unit</p>
                  </div>
                  <button className="text-[#ba1a1a] p-1 hover:bg-[#ffdad6]/50 rounded"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#c8c5d3]/40 pt-4 bg-white mt-4">
              <Input label="Tanggal Pengembalian Alat" type="date" icon="calendar_today" required />
              <div className="flex items-start gap-2">
                <input type="checkbox" id="agree" className="mt-0.5 rounded text-[#4648d4] border-[#c8c5d3]" required />
                <label htmlFor="agree" className="text-[11px] text-[#474651] leading-tight cursor-pointer">Saya setuju untuk menjaga alat dan bertanggung jawab penuh jika terjadi kerusakan fisik.</label>
              </div>
              <Button variant="secondary" className="w-full py-3" icon="send">Ajukan Peminjaman ({cartCount})</Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}