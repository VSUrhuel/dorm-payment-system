"use client";

import { Button } from "../../../../components/ui/button";
import { FileDown } from "lucide-react";

interface ExpensesHeaderProps {
  onExport: () => void;
}

export default function ExpensesHeaderDormer({
  onExport
}: ExpensesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-1.5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
          Expenses
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#12372A]">
          Track all the expenses of the dormitory
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-full sm:w-auto border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all text-xs sm:text-sm"
          onClick={onExport}
          size={undefined}
        >
          <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
