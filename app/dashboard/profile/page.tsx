// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🟢 KUNCI UTAMA: Simpan userId ke dalam State React agar tidak hilang saat submit
  const [userId, setUserId] = useState("");

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- 1. MEMUAT DATA PROFIL SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    async function loadProfile() {
      // 🟢 REVISI: Pastikan kode dieksekusi murni di sisi browser (Client-Side)
      if (typeof window === "undefined") return;

      const rawData = localStorage.getItem("user");
      if (!rawData) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = JSON.parse(rawData);
        
        // 🟢 REVISI: Validasi ID aman untuk mencegah alert palsu akibat lag sinkronisasi
        if (!storedUser || !storedUser.id) {
          console.error("User ID tidak ditemukan di localStorage. Data saat ini:", storedUser);
          alert("Sesi browser Anda menggunakan data lama atau ID tidak ditemukan. Silakan klik LOGOUT lalu LOGIN kembali agar data tersinkronisasi.");
          setLoading(false);
          return;
        }

        // Kunci ID ke dalam state React agar siap digunakan kapan saja
        setUserId(storedUser.id);

        const res = await fetch(`/api/profile?userId=${storedUser.id}`);
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setPhone(data.phone || "");
          setEmail(data.email);
          setRole(data.role);
        } else {
          alert(data.message || "Gagal mengambil data dari server.");
        }
      } catch (err) {
        console.error("Gagal memuat data profil:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // --- 2. EKSEKUSI TOMBOL SIMPAN PERUBAHAN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        userId, // 🟢 AMBIL LANGSUNG DARI STATE: Dijamin aman, tidak akan undefined!
        name,
        phone,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      };

      console.log("DATA YANG DIKIRIM KE BACKEND:", payload);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profil Anda berhasil diperbarui di database!");
        
        // Perbarui localStorage untuk sinkronisasi nama di Navbar/Sidebar
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, name: data.user.name }));
        
        // Reset form password
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Gagal memperbarui profil.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-[#777682]">Memuat informasi akun Anda...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">Profil Saya</h2>
        <p className="text-[14px] text-[#474651] mt-1">Kelola informasi data diri pribadi dan konfigurasi sistem keamanan sandi akun Anda.</p>
      </div>

      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c8c5d3]/60">
          
          {/* Avatar Column */}
          <div className="lg:col-span-4 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#e5eeff] bg-[#d3e4fe] text-[#1a146b] font-black text-4xl flex items-center justify-center shadow-inner mb-4">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="px-3 py-1 bg-[#312e81] text-white font-bold text-[12px] rounded-full uppercase tracking-wider mb-2">
              {role}
            </span>
            <p className="text-[12px] text-[#777682]">Terdaftar Resmi di Sistem LabReserve</p>
          </div>

          {/* Form Fields Data Column */}
          <form className="lg:col-span-8 p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Bio Section */}
            <div className="space-y-4">
              <h4 className="text-[16px] font-bold text-[#1a146b] flex items-center gap-1.5 border-b border-[#c8c5d3]/30 pb-2">
                <span className="material-symbols-outlined">person</span> Informasi Pribadi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Nomor Telepon / WA" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 08123456789" />
                <div className="sm:col-span-2">
                  <Input label="Alamat Email Akademik" value={email} disabled className="bg-[#f8f9ff] cursor-not-allowed opacity-75" />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4 pt-4 border-t border-[#c8c5d3]/30">
              <h4 className="text-[16px] font-bold text-[#1a146b] flex items-center gap-1.5 border-b border-[#c8c5d3]/30 pb-2">
                <span className="material-symbols-outlined">shield</span> Ubah Kata Sandi (Opsional)
              </h4>
              <p className="text-[12px] text-[#777682] -mt-2">Kosongkan kolom di bawah jika Anda tidak berniat mengganti kata sandi.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Kata Sandi Lama" type="password" placeholder="Masukkan sandi lama..." value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <Input label="Kata Sandi Baru" type="password" placeholder="Minimal 6 karakter..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Input label="Konfirmasi Kata Sandi Baru" type="password" placeholder="Ulangi sandi baru..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            {/* Form Actions Toolbar */}
            <div className="pt-4 border-t border-[#c8c5d3]/40 flex justify-end gap-3 bg-white">
              <Button variant="outline" type="button" onClick={() => window.location.reload()}>Reset Form</Button>
              <Button variant="primary" type="submit" isLoading={submitting} icon="save">Simpan Perubahan</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}