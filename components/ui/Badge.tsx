"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "primary" | "secondary";
  children: React.ReactNode;
}

export default function Badge({
  variant = "info",
  className = "",
  children,
  ...props
}: BadgeProps) {
  // Base styles: pill shape bulat penuh sesuai DESIGN.md
  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border tracking-wide whitespace-nowrap";

  // Skema warna fungsional kombinasi CSS asli Stitch & token DESIGN.md
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20",
    info: "bg-[#eff4ff] text-[#1a146b] border-[#c8c5d3]",
    primary: "bg-[#e2dfff] text-[#100563] border-[#c3c0ff]",
    secondary: "bg-[#e1e0ff] text-[#07006c] border-[#c0c1ff]",
  };

  // Titik indikator kecil di dalam badge untuk estetika dasbor modern
  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-[#ba1a1a]",
    info: "bg-[#1a146b]",
    primary: "bg-[#3e3c8f]",
    secondary: "bg-[#4648d4]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  );
}