"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "error" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  // Base styles dari DESIGN.md (rounded-lg/md, font-inter, transition)
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  
  // Varian warna berdasarkan token DESIGN.md
  const variants = {
    primary: "bg-[#1a146b] text-white hover:bg-[#312e81] shadow-md shadow-[#1a146b]/10",
    secondary: "bg-[#4648d4] text-white hover:bg-[#6063ee] shadow-md shadow-[#4648d4]/10",
    error: "bg-[#ba1a1a] text-white hover:bg-[#93000a] shadow-sm",
    outline: "bg-transparent border border-[#c8c5d3] text-[#474651] hover:bg-[#eff4ff] hover:text-[#0b1c30]",
  };

  // Ukuran tombol sesuai spacing grid
  const sizes = {
    sm: "px-3 py-1.5 text-[12px]",
    md: "px-5 py-2.5 text-[14px]",
    lg: "px-6 py-3 text-[16px] font-semibold",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">
          progress_activity
        </span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}