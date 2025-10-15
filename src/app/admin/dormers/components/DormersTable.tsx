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
import { FileText, Eye, Trash } from "lucide-react";
import { Dormer } from "../types";

interface DormersTableProps {
  dormers: Dormer[];
  onGenerateBill: (dormer: Dormer) => void;
  onViewBills: (dormer: Dormer) => void;
  onDelete: (dormer: Dormer) => void;
}

export default function DormersTable({
  dormers,
  onGenerateBill,
  onViewBills,
  onDelete,
}: DormersTableProps) {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className={undefined}>
        <CardTitle className="text-lg font-semibold">Dormer Records</CardTitle>
      </CardHeader>
      <CardContent className={undefined}>
        <Table className={undefined}>
          <TableHeader className={undefined}>
            <TableRow className={undefined}>
              <TableHead className={undefined}>Resident</TableHead>
              <TableHead className={undefined}>Room</TableHead>
              <TableHead className={undefined}>Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={undefined}>
            {dormers.map((dormer) => (
              <TableRow className="hover:bg-gray-50" key={dormer.id}>
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
                <TableCell className={undefined}>{dormer.roomNumber}</TableCell>
                <TableCell className={undefined}>
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
                      variant={undefined}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(dormer)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      variant={undefined}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
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
