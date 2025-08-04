"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";

export default function ExpensesHeader({ setAddExpenseModalOpen }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all dormitory expenses
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setAddExpenseModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Expense
        </Button>
      </div>
    </div>
  );
}
