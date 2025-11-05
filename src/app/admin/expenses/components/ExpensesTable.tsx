"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { Eye, Calendar, ImageIcon, TrendingDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAmount } from "../utils";
import { ExpenseData } from "../types";

interface ExpensesTableProps {
  expenses: ExpenseData[];
  onViewDetails: (expense: ExpenseData) => void;
}

export default function ExpensesTable({
  expenses,
  onViewDetails,
}: ExpensesTableProps) {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ExpenseData | null>(
    null
  );

  const getCategoryBadge = (category: ExpenseData["category"]) => {
    const config = {
      Utilities: "bg-blue-100 text-blue-800 border-blue-200",
      Maintenance: "bg-orange-100 text-orange-800 border-orange-200",
      Security: "bg-purple-100 text-purple-800 border-purple-200",
      Supplies: "bg-[#A5D6A7]/30 text-[#2E7D32] border-[#A5D6A7]",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return config[category] || config["Other"];
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const handleViewReceipt = (expense: ExpenseData) => {
    setSelectedReceipt(expense);
    setReceiptModalOpen(true);
  };

  return (
    <>
      <Card className="border-2 border-gray-100 shadow-md bg-white">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl md:text-2xl font-bold text-[#12372A]">
            Expense Records
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Complete list of all recorded expenses</p>
        </CardHeader>
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">              
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                No expenses recorded
              </h3>
              
              <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                Get started by recording your first expense. Click the 'Add Expense' button to begin tracking expenses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className={undefined}>
                <TableHeader className={undefined}>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="font-semibold text-gray-700">Title & Description</TableHead>
                    <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700">Expense Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Receipt</TableHead>
                    <TableHead className="hidden lg:table-cell font-semibold text-gray-700">
                      Recorded By
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={undefined}>
                  {expenses.map((expense) => (
                    <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-50" key={expense.id}>
                      <TableCell className={undefined}>
                        <div className="font-semibold text-[#333333]">
                          {expense.title}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {expense.description}
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-1.5 border ${getCategoryBadge(expense.category)}`}
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className={undefined}>
                        <div className="font-bold text-red-600 text-lg">
                          ₱{formatAmount(expense.amount)}
                        </div>
                      </TableCell>
                      <TableCell className={undefined}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-[#333333]">
                            {formatDate(expense.expenseDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={undefined}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReceipt(expense)}
                          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all font-medium"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2 border-[#A5D6A7]">
                            <AvatarFallback className="bg-[#A5D6A7] text-[#2E7D32] text-xs font-semibold">
                              {expense.recordedBy?.firstName?.[0]}
                              {expense.recordedBy?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-[#333333]">
                              {expense.recordedBy.firstName}{" "}
                              {expense.recordedBy.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {expense.recordedBy.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(expense)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className={undefined}>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Receipt Image
            </DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedReceipt.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedReceipt.expenseDate)}
                </p>
                <p className="text-lg font-bold text-red-600">
                  ₱{formatAmount(selectedReceipt.amount)}
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {selectedReceipt.receiptImageUrl ? (
                  <Image
                    src={selectedReceipt.receiptImageUrl}
                    alt="Receipt"
                    width={500}
                    height={500}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                ) : (
                  <div className="text-sm text-center text-gray-500 p-4">
                    No receipt image available.
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
