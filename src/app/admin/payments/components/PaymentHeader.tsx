"use client";

import { Button } from "../../../../components/ui/button";
import { FileDown } from "lucide-react";

interface PaymentHeaderProps {
  onExport: () => void;
}

export default function PaymentHeader({ onExport }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
          Payment Management
        </h1>
        <p className="text-sm md:text-base text-[#12372A] mt-1">
          Manage and track all bills and payments for the dormitory
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onExport}
        className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all"
        size="default"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}
