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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
          Expenses Management
        </h1>
        <p className="text-sm md:text-base text-[#12372A] mt-1">
          Manage and track all expenses for the dormitory
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all"
          onClick={onExport}
          size={undefined}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all"
          onClick={onEmailReport}
          disabled={isSendingEmail}
          size={undefined}
        >
          {isSendingEmail ? (
            "Sending..."
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" /> Email Report
            </>
          )}
        </Button>
        <Button
          className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all"
          onClick={onAdd}
          variant={undefined}
          size={undefined}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expenses
        </Button>
      </div>
    </div>
  );
}
