"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  date: string;
  role: "STUDENT" | "LECTURER";
  approved: boolean;
  locked: boolean;
}

export default function UserModerationPage() {
  const [users, setUsers] = useState<UserAccount[]>([
    { id: "S-88210", name: "Julian Sterling", email: "j.sterling@university.edu", date: "24 Okt 2026", role: "STUDENT", approved: true, locked: false },
    { id: "L-44921", name: "Dr. Eleanor Vance", email: "e.vance@science.edu", date: "23 Okt 2026", role: "LECTURER", approved: false, locked: false },
    { id: "S-88214", name: "Marcus Thorne", email: "m.thorne@university.edu", date: "23 Okt 2026", role: "STUDENT", approved: true, locked: true },
    { id: "S-88220", name: "Sarah Jenkins", email: "s.jenkins@university.edu", date: "22 Okt 2026", role: "STUDENT", approved: false, locked: false },
  ]);

  const toggleApprove = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, approved: !u.approved } : u));
  };

  const toggleLock = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, locked: !u.locked } : u));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Account Moderation</h1>
          <p className="text-[14px] text-[#474651]">Kelola hak akses dan persetujuan pembuatan akun mahasiswa serta dosen peneliti.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="filter_list">Filter</Button>
          <Button variant="primary" icon="file_download">Export CSV</Button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#1a146b] p-2 bg-[#e5eeff] rounded-lg">pending_actions</span>
          <div className="text-[36px] font-bold text-[#1a146b] mt-2">24</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Permohonan Baru</p>
        </div>
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#4648d4] p-2 bg-[#e5eeff] rounded-lg">school</span>
          <div className="text-[36px] font-bold text-[#0b1c30] mt-2">1,240</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Mahasiswa Aktif</p>
        </div>
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#3e1a00] p-2 bg-[#ffdbc7] rounded-lg">workspace_premium</span>
          <div className="text-[36px] font-bold text-[#0b1c30] mt-2">86</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Dosen Terdaftar</p>
        </div>
        <div className="p-5 bg-white border border-[#c8c5d3] rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[#ba1a1a] p-2 bg-[#ffdad6] rounded-lg">lock</span>
          <div className="text-[36px] font-bold text-[#0b1c30] mt-2">12</div>
          <p className="text-[11px] font-bold text-[#777682] uppercase tracking-wider">Akun Dibekukan</p>
        </div>
      </div>

      {/* Registration Request Table Card Container */}
      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#c8c5d3] bg-[#eff4ff]">
          <h3 className="text-[16px] font-bold text-[#1a146b]">Daftar Registrasi Akun</h3>
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
                <th className="px-6 py-3 text-center">Izinkan Akses</th>
                <th className="px-6 py-3 text-center">Kunci Akun</th>
                <th className="px-6 py-3 text-right">Sandi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-[#3e3c8f]">#{user.id}</td>
                  <td className="px-6 py-4 font-semibold text-[#0b1c30]">{user.name}</td>
                  <td className="px-6 py-4 text-[#474651]">{user.email}</td>
                  <td className="px-6 py-4 text-[#474651]">{user.date}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={user.role === "LECTURER" ? "primary" : "secondary"}>{user.role}</Badge>
                  </td>
                  {/* Toggle Approve Switch Component */}
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={user.approved} onChange={() => toggleApprove(user.id)} className="sr-only peer" />
                      <div className="w-10 h-5 bg-[#c8c5d3] rounded-full peer peer-checked:bg-[#4648d4] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  {/* Toggle Lock Switch Component */}
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={user.locked} onChange={() => toggleLock(user.id)} className="sr-only peer" />
                      <div className="w-10 h-5 bg-[#c8c5d3] rounded-full peer peer-checked:bg-[#ba1a1a] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-[#474651] hover:text-[#1a146b] hover:bg-[#e5eeff] rounded-lg transition-all" title="Reset Password">
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}