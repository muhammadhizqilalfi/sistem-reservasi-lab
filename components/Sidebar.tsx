"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  title: string;
  path: string;
  icon: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Membaca data user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role); // 'STUDENT', 'LECTURER', atau 'LABSTAFF'
      } catch (e) {
        console.error("Gagal membaca session user", e);
      }
    }
  }, []);

  // 1. Menu Navigasi khusus Mahasiswa (STUDENT)
  const studentMenus: MenuItem[] = [
    { title: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { title: "Reservasi Lab", path: "/dashboard/booking", icon: "biotech" },
    { title: "Pinjam Alat", path: "/dashboard/inventory", icon: "construction" },
    { title: "Riwayat", path: "/dashboard/history", icon: "history" },
    { title: "Profil", path: "/dashboard/profile", icon: "person" },
  ];

  // 2. Menu Navigasi khusus Dosen (LECTURER)
  const lecturerMenus: MenuItem[] = [
    { title: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { title: "Bulk Scheduling", path: "/dashboard/bulk-scheduler", icon: "event_repeat" },
    { title: "Reschedule Sidang", path: "/dashboard/reschedule", icon: "calendar_month" },
    { title: "Riwayat Pengajuan", path: "/dashboard/history", icon: "history" },
    { title: "Profil", path: "/dashboard/profile", icon: "person" },
  ];

  // 3. Menu Navigasi khusus Asisten/Staf Lab (LABSTAFF)
  const labStaffMenus: MenuItem[] = [
    { title: "Dashboard Admin", path: "/dashboard", icon: "dashboard" },
    { title: "Antrean Persetujuan", path: "/dashboard/approvals", icon: "how_to_reg" },
    { title: "Kelola Lab", path: "/dashboard/manage-labs", icon: "science" },
    { title: "Kelola Inventaris", path: "/dashboard/manage-inventory", icon: "inventory_2" },
    { title: "Moderasi User", path: "/dashboard/users", icon: "group" },
    { title: "Audit Log", path: "/dashboard/audit-log", icon: "history" },
  ];

  // Menentukan list menu berdasarkan role aktif
  const getActiveMenus = () => {
    if (role === "STUDENT") return studentMenus;
    if (role === "LECTURER") return lecturerMenus;
    if (role === "LABSTAFF") return labStaffMenus;
    return []; // Fallback kosong jika role belum termuat
  };

  const currentMenus = getActiveMenus();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-4 px-3 bg-[#e5eeff] dark:bg-[#dce9ff] border-r border-[#c8c5d3] shadow-sm z-50">
      {/* Brand Header */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1a146b] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">biotech</span>
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[#1a146b] leading-tight">LabReserve</h1>
            <p className="text-[12px] font-medium text-[#777682]">Academic Portal</p>
          </div>
        </div>
      </div>

      {/* Navigasi Dinamis */}
      <nav className="flex-1 space-y-1">
        {currentMenus.map((menu) => {
          const isActive = pathname === menu.path;
          return (
            <Link
              key={menu.path}
              href={menu.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-[#312e81] text-white font-bold shadow-sm"
                  : "text-[#474651] hover:bg-[#d3e4fe] hover:text-[#0b1c30]"
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {menu.icon}
              </span>
              <span>{menu.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigasi (Settings & Logout) */}
      <div className="pt-4 border-t border-[#c8c5d3]/50 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2 text-[#474651] hover:bg-[#d3e4fe] text-[14px] rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/50 text-[14px] rounded-lg transition-all text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}