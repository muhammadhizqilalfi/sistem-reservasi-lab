"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: string;
  children: React.ReactNode;
}

export default function Select({
  label,
  error,
  icon,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-[12px] font-medium text-[#474651]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777682] text-[20px] pointer-events-none">
            {icon}
          </span>
        )}
        
        <select
          id={id}
          className={`w-full py-2 bg-white border rounded-lg text-[14px] text-[#0b1c30] outline-none appearance-none transition-all duration-200 pr-10
            ${icon ? "pl-10" : "pl-4"}
            ${
              error
                ? "border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20"
                : "border-[#c8c5d3] focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
            } 
            ${className}`}
          {...props}
        >
          {children}
        </select>
        
        {/* Custom Arrow Icon di ujung kanan agar seragam di semua browser */}
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#474651] text-[22px]">
          arrow_drop_down
        </span>
      </div>
      {error && (
        <p className="text-[11px] font-medium text-[#ba1a1a]">
          {error}
        </p>
      )}
    </div>
  );
}