"use client";

import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { ExpenseData } from "../types";

interface ExpensesFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  paginatedExpenses: ExpenseData[];
  filteredExpenses: ExpenseData[];
}

export default function ExpensesFilter({
  setSearchTerm,
  setCategoryFilter,
  searchTerm,
  categoryFilter,
  paginatedExpenses,
  filteredExpenses,
}: ExpensesFilterProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title, description, or recorded by..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base border-gray-300"
                type={undefined}
              />
            </div>
          </div>

          <div className="w-full md:w-36">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-gray-300 w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="All" className={undefined}>
                  All Categories
                </SelectItem>
                <SelectItem value="Utilities" className={undefined}>
                  Utilities
                </SelectItem>
                <SelectItem value="Maintenance" className={undefined}>
                  Maintenance
                </SelectItem>
                <SelectItem value="Security" className={undefined}>
                  Security
                </SelectItem>
                <SelectItem value="Supplies" className={undefined}>
                  Supplies
                </SelectItem>
                <SelectItem value="Other" className={undefined}>
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || categoryFilter !== "All") && (
            <div className="w-full md:w-auto">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("All");
                }}
                className="w-full mt-2 md:mt-0 bg-[#2E7D32] hover:bg-[#27632a] text-white"
                variant={undefined}
                size={undefined}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {paginatedExpenses.length} of {filteredExpenses.length}{" "}
          expenses
        </div>
      </CardContent>
    </Card>
  );
}
