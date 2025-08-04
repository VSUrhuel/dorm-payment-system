"use client";

import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
/**
 * @param {{
 * searchTerm: string;
 * onSearchChange: (value: string) => void;
 * statusFilter: string;
 * onStatusChange: (value: string) => void;
 * count: number;
 * }} props
 */
export default function DormerFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  count,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search dormers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Rooms</SelectItem>
            <SelectItem value="1">Room 1</SelectItem>
            <SelectItem value="2">Room 2</SelectItem>
            <SelectItem value="3">Room 3</SelectItem>
            <SelectItem value="4A">Room 4A</SelectItem>
            <SelectItem value="4B">Room 4B</SelectItem>
            <SelectItem value="5">Room 5</SelectItem>
            <SelectItem value="6">Room 6</SelectItem>
            <SelectItem value="7">Room 7</SelectItem>
            <SelectItem value="8">Room 8</SelectItem>
            <SelectItem value="9">Room 9</SelectItem>
            <SelectItem value="SA Room">SA Room</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-end">
        <Badge variant="outline" className="bg-gray-50">
          {count} {count === 1 ? "dormer" : "dormers"}
        </Badge>
      </div>
    </div>
  );
}
