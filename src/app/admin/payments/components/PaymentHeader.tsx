"use client";

import { Button } from "../../../../components/ui/button";
import { FileDown } from "lucide-react";

interface PaymentHeaderProps {
  onExport: () => void;
}

export default function PaymentHeader({ onExport }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Payment Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and track all bills and payments for the dormitory
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onExport}
        className="border-gray-200 hover:bg-gray-50"
        size={undefined}
      >
        <FileDown className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}
