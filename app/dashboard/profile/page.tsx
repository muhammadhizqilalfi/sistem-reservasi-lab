"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Profil Saya</h2>
        <p className="text-[14px] text-[#474651] mt-1">Kelola informasi data diri pribadi dan konfigurasi sistem keamanan sandi akun Anda.</p>
      </div>

      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c8c5d3]/60">
          {/* Avatar frame loader column */}
          <div className="lg:col-span-4 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#e5eeff] bg-[#d3e4fe] text-[#1a146b] font-black text-4xl flex items-center justify-center shadow-inner mb-4">
              M
            </div>
            <Button variant="outline" size="sm" icon="photo_camera" className="mb-2">Unggah Foto Baru</Button>
            <p className="text-[11px] text-[#777682] max-w-[200px] leading-relaxed">Format berkas diizinkan: JPG atau PNG. Maksimal ukuran: 2MB.</p>
          </div>

          {/* Form fields data column */}
          <form className="lg:col-span-8 p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Profil Berhasil Diperbarui!"); }}>
            {/* Block 1: Bio */}
            <div className="space-y-4">
              <h4 className="text-[16px] font-bold text-[#1a146b] flex items-center gap-1.5 border-b border-[#c8c5d3]/30 pb-2">
                <span className="material-symbols-outlined">person</span> Informasi Pribadi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nama Lengkap" defaultValue="Muadz Kuliah" required />
                <Input label="Nomor Telepon" defaultValue="+62 812-3456-7890" type="tel" />
                <div className="sm:col-span-2">
                  <Input label="Alamat Email Akademik" defaultValue="muadz@mahasiswa.ac.id" type="email" disabled className="bg-[#f8f9ff] cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Block 2: Security */}
            <div className="space-y-4 pt-4 border-t border-[#c8c5d3]/30">
              <h4 className="text-[16px] font-bold text-[#1a146b] flex items-center gap-1.5 border-b border-[#c8c5d3]/30 pb-2">
                <span className="material-symbols-outlined">shield</span> Keamanan Akun
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Input label="Kata Sandi Lama" type="password" placeholder="••••••••••••" /></div>
                <Input label="Kata Sandi Baru" type="password" placeholder="Sandi baru..." />
                <Input label="Konfirmasi Kata Sandi" type="password" placeholder="Ulangi sandi..." />
              </div>
            </div>

            {/* Submit Toolbar Panels */}
            <div className="pt-4 border-t border-[#c8c5d3]/40 flex justify-end gap-3 bg-white">
              <Button variant="outline" type="button">Batal</Button>
              <Button variant="primary" type="submit" icon="save">Simpan Perubahan</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}