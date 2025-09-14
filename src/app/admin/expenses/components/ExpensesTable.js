"use client";

import { Button } from "./../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../../../components/ui/card";
import { Badge } from "./../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../../../components/ui/table";
import { Avatar, AvatarFallback } from "./../../../../components/ui/avatar";
import { Eye, Edit, Calendar, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./../../../../components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { formatAmount } from "../utils";

/**
 * @param {{
 * expenses: any[];
 * onViewDetails: (expense: any) => void;
 * onEditExpense: (expense: any) => void;
 * }} props
 */
export default function ExpensesTable({ expenses, onViewDetails }) {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      Utilities: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        variant: "default",
      },
      Maintenance: {
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        variant: "secondary",
      },
      Security: {
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        variant: "secondary",
      },
      Supplies: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        variant: "default",
      },
      Other: {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        variant: "secondary",
      },
    };

    return categoryConfig[category] || categoryConfig["Other"];
  };

  const formatCurrency = (amount) => {
    return `₱${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewReceipt = (expense) => {
    setSelectedReceipt(expense);
    setReceiptModalOpen(true);
  };

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Expense Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title & Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Expense Date</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Recorded By
                </TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => {
                const categoryConfig = getCategoryBadge(expense.category);

                return (
                  <TableRow className="hover:bg-gray-50" key={expense.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {expense.title}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {expense.description}
                        </div>
                        <Badge
                          variant={categoryConfig.variant}
                          className={categoryConfig.className}
                        >
                          {expense.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-red-600 text-lg">
                        ₱{formatAmount(parseFloat(expense.amount) || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {formatDate(expense.expenseDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReceipt(expense)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                            {expense.recordedBy.firstName[0]}
                            {expense.recordedBy.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
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
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(expense)}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Receipt Image
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
                  {formatCurrency(selectedReceipt.amount)}
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {selectedReceipt.receiptImageUrl ? (
                  <Image
                    src={selectedReceipt.receiptImageUrl}
                    alt="Receipt"
                    className="w-full h-auto max-h-96 object-contain"
                    width={500}
                    height={500}
                  />
                ) : (
                  <div className="text-sm text-center text-gray-500 p-4 border rounded-md">
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
