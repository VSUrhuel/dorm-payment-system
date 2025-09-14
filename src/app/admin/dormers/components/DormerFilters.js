"use client";

import { Button } from "./../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../../../components/ui/card";
import { Input } from "./../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../../../components/ui/select";
import { FileDown, Search, Filter, Plus } from "lucide-react";
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
  resetFilter,
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title, description, or recorded by..."
                value={searchTerm}
                onChange={onSearchChange}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>
          <div className="w-full md:w-auto mr-2">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
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

          {(searchTerm || statusFilter !== "All") && (
            <div className="w-full md:w-26">
              <Button
                onClick={resetFilter}
                className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {count} dormers
        </div>
      </CardContent>
    </Card>
  );
}
