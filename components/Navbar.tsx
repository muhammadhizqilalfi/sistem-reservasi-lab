"use client";

import { useEffect, useState } from "react";

type UserState = {
  name: string;
  role: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<UserState>({
    name: "Loading...",
    role: "User",
    email: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Transformasi string role agar tampilan label lebih ramah dibaca
        let roleLabel = "Student";
        if (parsed.role === "LECTURER") roleLabel = "Lecturer / Researcher";
        if (parsed.role === "LABSTAFF") roleLabel = "Lab Supervisor / Admin";

        setUser({
          name: parsed.name || "Academic User",
          role: roleLabel,
          email: parsed.email,
        });
      } catch (e) {
        console.error("Gagal memproses data profile navbar", e);
      }
    }
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 border-b border-[#c8c5d3] shadow-sm flex justify-between items-center px-6 z-40 backdrop-blur-md">
      {/* Kolom Pencarian Universal */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]">
            search
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-1.5 bg-[#eff4ff] border border-[#c8c5d3] rounded-full text-[14px] text-[#0b1c30] placeholder-[#474651]/60 focus:ring-2 focus:ring-[#1a146b] focus:outline-none transition-all"
            placeholder="Cari reservasi, log audit, atau alat..."
          />
        </div>
      </div>

      {/* Panel Kanan Status Notifikasi & Akun */}
      <div className="flex items-center gap-6">
        {/* Notifikasi Alert */}
        <button className="relative p-2 text-[#474651] hover:text-[#1a146b] rounded-full hover:bg-[#eff4ff] transition-all cursor-pointer active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white"></span>
        </button>

        {/* Profil Informasi Pengguna */}
        <div className="flex items-center gap-3 border-l border-[#c8c5d3] pl-6">
          <div className="text-right">
            <p className="font-bold text-[14px] text-[#1a146b] leading-tight">
              {user.name}
            </p>
            <p className="text-[12px] text-[#777682] mt-0.5">
              {user.role}
            </p>
          </div>
          {/* Avatar frame */}
          <div className="w-10 h-10 rounded-full border border-[#1a146b] bg-[#d3e4fe] flex items-center justify-center font-bold text-[#1a146b]">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}