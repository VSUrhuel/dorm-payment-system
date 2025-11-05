"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface DormerFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  count: number;
  resetFilter: () => void;
}

export default function DormerFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  count,
  resetFilter,
}: DormerFiltersProps) {
  return (
    <Card className="border-2 border-gray-100 shadow-md bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, email, or room number..."
                value={searchTerm}
                onChange={onSearchChange}
                className="pl-10 border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32] h-11"
                type={undefined}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32] h-11">
                <Filter className="h-4 w-4 mr-2 text-[#2E7D32]" />
                <SelectValue placeholder="Filter by room" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="All" className={undefined}>
                  All Rooms
                </SelectItem>
                <SelectItem value="1" className={undefined}>
                  Room 1
                </SelectItem>
                <SelectItem value="2" className={undefined}>
                  Room 2
                </SelectItem>
                <SelectItem value="3" className={undefined}>
                  Room 3
                </SelectItem>
                <SelectItem value="4A" className={undefined}>
                  Room 4A
                </SelectItem>
                <SelectItem value="4B" className={undefined}>
                  Room 4B
                </SelectItem>
                <SelectItem value="5" className={undefined}>
                  Room 5
                </SelectItem>
                <SelectItem value="6" className={undefined}>
                  Room 6
                </SelectItem>
                <SelectItem value="7" className={undefined}>
                  Room 7
                </SelectItem>
                <SelectItem value="8" className={undefined}>
                  Room 8
                </SelectItem>
                <SelectItem value="9" className={undefined}>
                  Room 9
                </SelectItem>
                <SelectItem value="SA Room" className={undefined}>
                  SA Room
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "All") && (
            <Button
              onClick={resetFilter}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all font-medium"
              size={undefined}
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            Showing <span className="text-[#2E7D32] font-bold">{count}</span> dormers
          </div>
          {(searchTerm || statusFilter !== "All") && (
            <div className="text-xs text-gray-500">
              {searchTerm && `Search: "${searchTerm}"`}
              {searchTerm && statusFilter !== "All" && " • "}
              {statusFilter !== "All" && `Room: ${statusFilter}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
