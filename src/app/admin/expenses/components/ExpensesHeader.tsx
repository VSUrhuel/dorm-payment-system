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
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Expenses Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and track all expenses for the dormitory
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50 w-36"
            onClick={onExport}
            size={undefined}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50 w-36"
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
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white w-36"
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
