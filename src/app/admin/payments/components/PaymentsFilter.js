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
// Added CalendarDays for the new filter's icon
import { Filter, Search, CalendarDays } from "lucide-react";

export default function PaymentsFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  billingPeriodFilter, // New prop for billing period value
  setBillingPeriodFilter, // New prop to set the billing period
  billingPeriods, // New prop for the list of available periods
  paginatedBills,
  filteredBills,
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by resident name, room, or period..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NEW: Billing Period Filter */}
          <div className="w-full md:w-36">
            <Select
              value={billingPeriodFilter}
              onValueChange={setBillingPeriodFilter}
            >
              <SelectTrigger className="border-gray-300">
                <CalendarDays className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Periods</SelectItem>
                {/* Dynamically populate periods from props */}
                {billingPeriods?.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-36">
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setBillingPeriodFilter("All");
              }}
              disabled={
                !searchTerm &&
                statusFilter === "All" &&
                billingPeriodFilter === "All"
              }
              className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {paginatedBills.length} of {filteredBills.length} bills
        </div>
      </CardContent>
    </Card>
  );
}
