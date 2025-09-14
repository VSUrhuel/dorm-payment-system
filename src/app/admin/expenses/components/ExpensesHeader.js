"use client";

import { Button } from "./../../../../components/ui/button";
import { FileDown, Plus, Mail } from "lucide-react";

export default function ExpensesHeader({
  setAddExpenseModalOpen,
  onExport,
  onEmailReport,
}) {
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
        <div class="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50 w-36"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50 w-36"
            onClick={onEmailReport}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </Button>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white w-36"
          onClick={setAddExpenseModalOpen}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expenses
        </Button>
      </div>
    </div>
  );
}
