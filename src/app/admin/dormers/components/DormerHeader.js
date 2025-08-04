"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";

/**
 * @param {{ onAddDormer: () => void; }} props
 */
export default function DormerHeader({ onAddDormer }) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dormer Management
        </h1>
        <p className="text-sm text-gray-600">
          Generate bills and track payments for all residents
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onAddDormer}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dormer
        </Button>
      </div>
    </div>
  );
}
