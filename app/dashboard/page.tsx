import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* 1. Sidebar Navigasi Kiri (Fixed h-screen) */}
      <Sidebar />

      {/* 2. Container Sebelah Kanan */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Top Navbar Header */}
        <Navbar />

        {/* 3. Konten Inti Canvas Utama (Diisi Halaman page.tsx masing-masing) */}
        <main className="flex-1 pt-24 px-8 pb-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}