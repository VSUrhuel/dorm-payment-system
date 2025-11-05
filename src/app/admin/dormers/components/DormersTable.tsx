"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Eye, Trash, Users, Search } from "lucide-react";
import { Dormer } from "../types";

interface DormersTableProps {
  dormers: Dormer[];
  onGenerateBill: (dormer: Dormer) => void;
  onViewBills: (dormer: Dormer) => void;
  onDelete: (dormer: Dormer) => void;
  hasFilters?: boolean;
  onResetFilters?: () => void;
}

export default function DormersTable({
  dormers,
  onGenerateBill,
  onViewBills,
  onDelete,
  hasFilters = false,
  onResetFilters,
}: DormersTableProps) {
  return (
    <Card className="border-2 border-gray-100 shadow-md bg-white">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-[#12372A]">
          Dormer Records
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">Complete list of all registered dormers</p>
      </CardHeader>
      <CardContent className="p-0">
        {dormers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#A5D6A7]/20 rounded-full blur-2xl"></div>
              <div className="relative p-6 rounded-full bg-[#2E7D32]">
                {hasFilters ? (
                  <Search className="h-12 w-12 text-white" />
                ) : (
                  <Users className="h-12 w-12 text-white" />
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[#333333] mb-2">
              {hasFilters ? "No dormers found" : "No dormers yet"}
            </h3>
            
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              {hasFilters
                ? "We couldn't find any dormers matching your search criteria. Try adjusting your filters or search terms."
                : "Get started by adding your first dormer to the system. Click the 'Add Dormer' button to begin."}
            </p>
            
            {hasFilters && onResetFilters && (
              <Button
                onClick={onResetFilters}
                variant="default"
                size="default"
                className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className={undefined}>
              <TableHeader className={undefined}>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="font-semibold text-gray-700">Resident</TableHead>
                  <TableHead className="font-semibold text-gray-700">Room</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold text-gray-700">Email</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={undefined}>
                {dormers.map((dormer) => (
                  <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-50" key={dormer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-[#A5D6A7]">
                          <AvatarFallback className="bg-[#A5D6A7] text-[#2E7D32] font-semibold">
                            {dormer.firstName[0]}
                            {dormer.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-[#333333]">
                            {dormer.firstName} {dormer.lastName}
                          </div>
                          <div className="text-xs text-gray-500 md:hidden">
                            {dormer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-[#2E7D32]">{dormer.roomNumber}</TableCell>
                    <TableCell className={undefined}>
                      <Badge
                        variant={dormer.role === "Admin" ? "default" : "secondary"}
                        className={
                          dormer.role === "Admin"
                            ? "bg-[#2E7D32] text-white hover:bg-[#2E7D32] font-medium"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium"
                        }
                      >
                        {dormer.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-600">
                      {dormer.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGenerateBill(dormer)}
                          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all font-medium"
                        >
                          <FileText className="h-4 w-4 mr-1" /> Bill
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewBills(dormer)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(dormer)}
                          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all font-medium"
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
