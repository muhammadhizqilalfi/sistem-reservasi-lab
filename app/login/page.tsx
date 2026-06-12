"use client";

import React, { useState, FormEvent } from "react";
import { 
  FlaskConical, 
  CalendarCheck, 
  Package, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Contact, 
  ChevronDown,
  Loader2
} from "lucide-react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showLoginPass, setShowLoginPass] = useState<boolean>(false);
  const [showRegPass, setShowRegPass] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State untuk penanganan pesan feedback
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form States
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "STUDENT",
    password: "",
  });

  // Reset feedback message ketika berganti tab
  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setMessage(null);
  };

  // Handler Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat login");
      }

      // Simpan token JWT ke localStorage atau cookie
      localStorage.setItem("token", data.token);
      setMessage({ type: "success", text: "Login Berhasil! Mengalihkan..." });
      
      // Redirect ke dashboard setelah sukses (sesuaikan path-nya)
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Register
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan saat registrasi");
      }

      setMessage({ type: "success", text: "Registrasi berhasil! Silakan masuk." });
      
      // Bersihkan form register dan pindah ke tab login
      setRegisterData({ name: "", email: "", phone: "", role: "mahasiswa", password: "" });
      setTimeout(() => {
        setActiveTab("login");
        setMessage(null);
      }, 2000);

    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8f9ff] text-[#0b1c30]">
      <main className="flex w-full min-h-screen">
        
        {/* SISI KIRI: Visual & Identity */}
        <section className="hidden md:flex md:w-1/2 pattern-bg relative items-center justify-center p-8 overflow-hidden min-h-screen">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute top-0 -left-1/4 w-full h-full rounded-full mix-blend-multiply filter blur-3xl animate-pulse bg-[#312e81]"></div>
            <div className="absolute bottom-0 -right-1/4 w-full h-full rounded-full mix-blend-multiply filter blur-3xl animate-pulse bg-[#4648d4] [animation-delay:2s]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-lg text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded-lg flex items-center justify-center">
                  <FlaskConical size={28} className="text-[#1a146b]" />
                </div>
                <span className="tracking-tight text-[16px] leading-[24px] font-600">
                  LabSystem v2.0
                </span>
              </div>
              <h1 className="leading-[44px] text-[36px] tracking-[-0.02em] font-700">
                Sistem Reservasi & Peminjaman Laboratorium
              </h1>
              <p className="text-white/80 leading-[24px] text-[16px] font-400">
                Kelola reservasi ruangan, peminjaman alat, dan absensi digital dalam satu platform terintegrasi. 
                Dirancang untuk menunjang produktivitas riset dan akademis.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 w-full">
              <div className="glass-card p-4 rounded-xl">
                <CalendarCheck size={24} className="mb-2 text-[#e1e0ff]" />
                <h3 className="text-[12px] leading-[16px] tracking-[0.01em] font-500">Penjadwalan Real-time</h3>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <Package size={24} className="mb-2 text-[#e1e0ff]" />
                <h3 className="text-[12px] leading-[16px] tracking-[0.01em] font-500">Manajemen Inventaris</h3>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-12 text-white/40 text-[12px] leading-[16px] tracking-[0.01em] font-500">
            © 2024 Laboratory Reservation System. All rights reserved.
          </div>
        </section>

        {/* SISI KANAN: Form Login / Register */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-6 min-h-screen bg-[#eff4ff]">
          <div className="w-full max-w-md">
            
            {/* Mobile Branding */}
            <div className="md:hidden flex flex-col items-center mb-8 text-center">
              <FlaskConical size={48} className="mb-2 text-[#1a146b]" />
              <h1 className="text-[28px] leading-[36px] tracking-[-0.01em] font-600 text-[#1a146b]">LabSystem</h1>
            </div>

            {/* Form Card */}
            <div className="shadow-sm rounded-xl p-8 w-full border bg-white border-[#c8c5d3]">
              
              {/* Tabs Button */}
              <div className="flex mb-6 border-b border-[#c8c5d3]">
                <button 
                  type="button"
                  className={`flex-1 py-3 border-b-2 transition-all text-center cursor-pointer text-[16px] leading-[24px] font-600 ${
                    activeTab === "login" ? "border-[#1a146b] text-[#1a146b]" : "border-transparent text-[#777682]"
                  }`}
                  onClick={() => handleTabChange("login")}
                >
                  Masuk
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-3 border-b-2 transition-all text-center cursor-pointer text-[16px] leading-[24px] font-600 ${
                    activeTab === "register" ? "border-[#1a146b] text-[#1a146b]" : "border-transparent text-[#777682]"
                  }`}
                  onClick={() => handleTabChange("register")}
                >
                  Daftar
                </button>
              </div>

              {/* Toast / Alert Message */}
              {message && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-500 border ${
                  message.type === "success" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {message.text}
                </div>
              )}

              {/* TAMPILAN FORM LOGIN */}
              {activeTab === "login" && (
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Email</label>
                    <div className="relative w-full">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                      <input 
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                        placeholder="nama@kampus.ac.id" 
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Kata Sandi</label>
                    <div className="relative w-full">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                      <input 
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                        placeholder="••••••••" 
                        type={showLoginPass ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors flex items-center cursor-pointer text-[#777682]" 
                        onClick={() => setShowLoginPass(!showLoginPass)} 
                        type="button"
                      >
                        {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-1">
                    <label className="flex items-center cursor-pointer group">
                      <input className="w-4 h-4 rounded border-[#c8c5d3]" type="checkbox"/>
                      <span className="ml-2 transition-colors text-[14px] leading-[20px] font-400 text-[#474651]">Ingat Saya</span>
                    </label>
                    <a className="hover:underline text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#4648d4]" href="#">Lupa Password?</a>
                  </div>
                  <button 
                    disabled={isLoading}
                    className="w-full py-3 text-white rounded-lg active:scale-[0.98] transition-all shadow-md cursor-pointer mt-2 text-[16px] leading-[24px] font-600 bg-[#1a146b] flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none" 
                    type="submit"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : "Masuk ke Akun"}
                  </button>
                  <div className="relative py-2 w-full flex items-center justify-center">
                    <div className="absolute w-full border-t border-[#c8c5d3]"></div>
                    <span className="relative px-3 uppercase text-[11px] leading-[14px] font-600 bg-white text-[#777682]">Atau</span>
                  </div>
                  <button 
                    className="w-full py-2.5 bg-white rounded-lg border hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer text-[16px] leading-[24px] font-600 border-[#c8c5d3] text-[#0b1c30]" 
                    type="button"
                  >
                    <img alt="Google" className="w-5 h-5 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfAWfiIJi5bBpRZEoZJiYOx9TGvMiIDC5GRiQI1jqOXlhuNfj5Qtv6ep575qz9FxLJlcM8lbuXaa-DhCQl8D_Nlv5qp-bDHm9w3foTi1rKtdfQr6dfuGiW70yYO29oTnY6KuFG9RUFDrw9H4s7NBnUdCtMbiovFwBOFdGm1l6flEuYzgJ3yE5hVxT28lOrthq0OF3-vtzGxOZIi7ZzHOKnMaf2fpqEucLCRkKloflS_xtO6F1gg8kBxI3snJBfkmItzfyfpE8_KyC8"/>
                    <span>Single Sign-On Kampus</span>
                  </button>
                </form>
              )}

              {/* TAMPILAN FORM REGISTER */}
              {activeTab === "register" && (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-1">
                    <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Nama Lengkap</label>
                    <div className="relative w-full">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                      <input 
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                        placeholder="Masukkan nama sesuai KTM/NIDN" 
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Email Institusi</label>
                    <div className="relative w-full">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                      <input 
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                        placeholder="nim@student.kampus.ac.id" 
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">No. Telepon</label>
                      <div className="relative w-full">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                        <input 
                          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                          placeholder="0812..." 
                          type="tel"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Peran</label>
                      <div className="relative w-full">
                        <Contact size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                        <select 
                          className="w-full pl-10 pr-8 py-2.5 bg-white rounded-lg border outline-none transition-all appearance-none text-[14px] leading-[20px] font-400 border-[#c8c5d3]"
                          value={registerData.role}
                          onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                        >
                          <option value="STUDENT">Mahasiswa</option>
                          <option value="LECTURER">Dosen</option>
                          <option value="LABSTAFF">Peneliti</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#777682]" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[12px] leading-[16px] tracking-[0.01em] font-500 text-[#474651]">Kata Sandi Baru</label>
                    <div className="relative w-full">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777682]" />
                      <input 
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border outline-none transition-all text-[14px] leading-[20px] font-400 border-[#c8c5d3]" 
                        placeholder="Minimal 8 karakter" 
                        type={showRegPass ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                      <button 
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors flex items-center cursor-pointer text-[#777682]" 
                        onClick={() => setShowRegPass(!showRegPass)} 
                        type="button"
                      >
                        {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] leading-[14px] font-600 text-[#474651]">
                    Dengan mendaftar, Anda menyetujui <a className="hover:underline text-[#1a146b]" href="#">Syarat & Ketentuan</a> serta <a className="hover:underline text-[#1a146b]" href="#">Kebijakan Privasi</a> kami.
                  </p>
                  <button 
                    disabled={isLoading}
                    className="w-full py-3 text-white rounded-lg active:scale-[0.98] transition-all shadow-md cursor-pointer mt-2 text-[16px] leading-[24px] font-600 bg-[#1a146b] flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none" 
                    type="submit"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : "Buat Akun Baru"}
                  </button>
                </form>
              )}
            </div>

            {/* Hubungi Admin */}
            <div className="mt-6 text-center w-full">
              <p className="text-[14px] leading-[20px] font-400 text-[#474651]">
                Butuh bantuan teknis? <a className="hover:underline ml-1 text-[16px] leading-[24px] font-600 text-[#4648d4]" href="#">Hubungi Admin Lab</a>
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}