// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Pastikan path globals.css ini sesuai posisi filemu

export const metadata: Metadata = {
  title: "LabReserve Dashboard",
  description: "Academic Laboratory Operations System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Mengunduh Font Inter & Google Material Icons */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f8f9ff] text-[#0b1c30]">
        {children}
      </body>
    </html>
  );
}