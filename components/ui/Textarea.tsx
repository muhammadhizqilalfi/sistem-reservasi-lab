"use client";

import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-[12px] font-medium text-[#474651]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-4 py-2 bg-white border rounded-lg text-[14px] text-[#0b1c30] placeholder-[#474651]/50 outline-none transition-all duration-200 resize-none
          ${
            error
              ? "border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20"
              : "border-[#c8c5d3] focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20"
          } 
          ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-medium text-[#ba1a1a]">
          {error}
        </p>
      )}
    </div>
  );
}