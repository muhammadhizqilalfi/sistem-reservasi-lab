"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  date: string;
  role: "STUDENT" | "LECTURER" | string;
}

export default function UserModerationPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "STUDENT" | "LECTURER">("ALL");

  // --- 1. FETCH DATA DARI DB ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      }
    } catch (err) {
      console.error("Gagal memuat data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. LOGIKA LIVE FILTER (SEARCH BAR & BUTTON FILTER) ---
  useEffect(() => {
    let result = users;

    // Filter Berdasarkan Teks Input (Nama atau Email)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // Filter Berdasarkan Role Badge
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  // --- 3. FITUR DELETE AKUN ---
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun "${name}" secara permanen?`)) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchUsers(); 
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menghapus user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 4. FITUR EXPORT TO CSV ---
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      alert("Tidak ada data user yang bisa diexport.");
      return;
    }

    const headers = ["User ID", "Nama Lengkap", "Alamat Email", "Tanggal Daftar", "Role"];
    
    const rows = filteredUsers.map(user => [
      `"${user.id}"`,
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.date}"`,
      `"${user.role}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.setAttribute("download", `Daftar_User_Filtered_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hitung statistik global dari seluruh user asli DB
  const totalStudents = users.filter(u => u.role === "STUDENT").length;
  const totalLecturers = users.filter(u => u.role === "LECTURER").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Account Moderation</h1>
          <p className="text-[14px] text-[#474651]">Kelola informasi pengguna, peninjauan hak akses, dan manajemen akun civitas akademika.</p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="primary" icon="file_download" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#1a146b] p-2 bg-[#e5eeff] rounded-lg">group</span>
          <div className="text-[36px] font-bold text-[#1a146b] mt-2">{users.length}</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Total Pengguna Terdaftar</p>
        </div>
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#4648d4] p-2 bg-[#e5eeff] rounded-lg">school</span>
          <div className="text-[36px] font-bold text-[#0b1c30] mt-2">{totalStudents}</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Mahasiswa Aktif</p>
        </div>
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#3e1a00] p-2 bg-[#ffdbc7] rounded-lg">workspace_premium</span>
          <div className="text-[36px] font-bold text-[#0b1c30] mt-2">{totalLecturers}</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Dosen Terdaftar</p>
        </div>
      </div>

      {/* PERTAHANKAN FILTER TOOLBAR COMPONENT */}
      <div className="p-4 flex flex-col md:flex-row gap-4 items-center bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
        <div className="flex-1 w-full">
          <Input 
            icon="search" 
            placeholder="Cari nama lengkap atau alamat email user..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Toggle Pilihan Cepat Filter Berdasarkan Role */}
        <div className="flex bg-[#f8f9ff] border border-[#c8c5d3] p-1 rounded-lg w-full md:w-auto justify-between gap-1">
          <button 
            onClick={() => setRoleFilter("ALL")}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${roleFilter === "ALL" ? "bg-white text-[#1a146b] shadow-sm font-bold" : "text-[#777682] hover:text-[#0b1c30]"}`}
          >
            Semua ({users.length})
          </button>
          <button 
            onClick={() => setRoleFilter("STUDENT")}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${roleFilter === "STUDENT" ? "bg-[#e5eeff] text-[#4648d4] shadow-sm font-bold" : "text-[#777682] hover:text-[#4648d4]"}`}
          >
            Mahasiswa ({totalStudents})
          </button>
          <button 
            onClick={() => setRoleFilter("LECTURER")}
            className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${roleFilter === "LECTURER" ? "bg-[#ffdbc7] text-[#3e1a00] shadow-sm font-bold" : "text-[#777682] hover:text-[#3e1a00]"}`}
          >
            Dosen ({totalLecturers})
          </button>
        </div>
      </div>

      {/* User Table Card Container */}
      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#c8c5d3] bg-[#eff4ff] flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1a146b]">Daftar Registrasi Akun</h3>
          {searchQuery && (
            <span className="text-[12px] text-[#474651] bg-white border px-2 py-0.5 rounded-md">
              Ditemukan: <b>{filteredUsers.length}</b> hasil
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase">
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Nama Lengkap</th>
                <th className="px-6 py-3">Alamat Email</th>
                <th className="px-6 py-3">Tgl Daftar</th>
                <th className="px-6 py-3 text-center">Role</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#777682]">
                    Memuat data registrasi user dari database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#777682]">
                    Tidak ada data akun user yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#3e3c8f]">#{user.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-semibold text-[#0b1c30]">{user.name}</td>
                    <td className="px-6 py-4 text-[#474651]">{user.email}</td>
                    <td className="px-6 py-4 text-[#474651]">{user.date}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={user.role === "LECTURER" ? "primary" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 text-[#777682] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-all" 
                        title="Hapus Akun Permanen"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}