"use client";
export default function FinesHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-1.5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
          Fines Management
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#12372A]">
          Generate fines and track payments for all residents
        </p>
      </div>
    </div>
  );
}
