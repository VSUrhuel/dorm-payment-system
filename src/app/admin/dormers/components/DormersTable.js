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
import { FileText, Eye } from "lucide-react";

/**
 * @param {{
 * dormers: any[];
 * onGenerateBill: (dormer: any) => void;
 * onViewBills: (dormer: any) => void;
 * }} props
 */
export default function DormersTable({ dormers, onGenerateBill, onViewBills }) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Dormer Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resident</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dormers.map((dormer) => (
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {dormer.firstName[0]}
                        {dormer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>
                        {dormer.firstName} {dormer.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dormer.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{dormer.roomNumber}</TableCell>
                <TableCell>
                  <Badge
                    variant={dormer.role === "Admin" ? "default" : "secondary"}
                    className={
                      dormer.role === "Admin"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {dormer.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {dormer.email}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateBill(dormer)}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 mr-1" /> Bill
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onViewBills(dormer)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
