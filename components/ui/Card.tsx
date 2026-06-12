"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevation" | "tonal" | "lowest";
  children: React.ReactNode;
}

export default function Card({
  variant = "elevation",
  className = "",
  children,
  ...props
}: CardProps) {
  
  // Gaya layer kedalaman sesuai panduan Elevation & Depth DESIGN.md
  const variants = {
    // Level 1: Background putih, border tipis, shadow halus
    elevation: "bg-white border border-[#c8c5d3] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]",
    // Tonal Layer untuk sidebar atau panel info sekunder
    tonal: "bg-[#e5eeff] border border-[#c8c5d3]",
    // Murni putih polosan tanpa elevasi
    lowest: "bg-white border border-[#c8c5d3]/50",
  };

  return (
    <div
      className={`rounded-xl p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}