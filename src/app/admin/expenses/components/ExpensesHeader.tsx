"use client";

import { Button } from "../../../../components/ui/button";
import { FileDown, Plus, Mail } from "lucide-react";

interface ExpensesHeaderProps {
  onAdd: () => void;
  onExport: () => void;
  onEmailReport: () => void;
  isSendingEmail: boolean;
}

export default function ExpensesHeader({
  onAdd,
  onExport,
  onEmailReport,
  isSendingEmail,
}: ExpensesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
      <div className="space-y-1 sm:space-y-1.5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
          Expenses Management
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#12372A]">
          Manage and track all expenses for the dormitory
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
        <Button
          variant="outline"
          className="w-full sm:w-auto border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all text-xs sm:text-sm"
          onClick={onEmailReport}
          disabled={isSendingEmail}
          size={undefined}
        >
          {isSendingEmail ? (
            "Sending..."
          ) : (
            <>
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" /> Email Report
            </>
          )}
        </Button>
        <Button
          className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all text-xs sm:text-sm"
          onClick={onAdd}
          variant={undefined}
          size={undefined}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
          Add Expenses
        </Button>
      </div>
    </div>
  );
}
