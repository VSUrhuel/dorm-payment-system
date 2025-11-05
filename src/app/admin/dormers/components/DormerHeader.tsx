"use client";

import { Button } from "../../../../components/ui/button";
import { FileDown, Plus, Users } from "lucide-react";

interface DormerHeaderProps {
  onAddDormer: () => void;
  onExport: () => void;
}

export default function DormerHeader({ onAddDormer, onExport }: DormerHeaderProps) {
  return (
    <div className="space-y-2 justify-between flex flex-col md:flex-row md:items-end">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#A5D6A7]">
            <Users className="h-6 w-6 text-[#2E7D32]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
            Dormer Management
          </h1>
        </div>
        <p className="text-sm md:text-base text-[#12372A] ml-14">
          Generate bills and track payments for all residents
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-[#2E7D32] hover:bg-[#12372A] text-white transition-all shadow-md hover:shadow-lg font-medium"
          onClick={onAddDormer}
          variant={undefined}
          size={undefined}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dormer
        </Button>
        <Button
          variant="outline"
          onClick={onExport}
          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all font-medium"
          size={undefined}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
