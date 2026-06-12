"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
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
        <input
          id={id}
          className={`w-full py-2 bg-white border rounded-lg text-[14px] text-[#0b1c30] placeholder-[#474651]/50 outline-none transition-all duration-200
            ${icon ? "pl-10 pr-4" : "px-4"}
            ${
              error
                ? "border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20"
                : "border-[#c8c5d3] focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
            } 
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[11px] font-medium text-[#ba1a1a] animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}