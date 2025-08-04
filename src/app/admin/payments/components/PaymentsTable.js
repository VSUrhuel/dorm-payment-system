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
import { Eye, CreditCard, Calendar } from "lucide-react";

/**
 * @param {{
 * bills: any[];
 * onViewDetails: (bill: any) => void;
 * onRecordbill: (bill: any) => void;
 * }} props
 */
export default function billsTable({ bills, onViewDetails, onRecordPayment }) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        variant: "default",
      },
      "Partially Paid": {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        variant: "secondary",
      },
      Unpaid: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        variant: "destructive",
      },
    };

    return statusConfig[status] || statusConfig["Unpaid"];
  };

  const formatCurrency = (amount) => {
    return `₱${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Bill Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resident</TableHead>
              <TableHead>Total Amount Due</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Remaining Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => {
              const statusConfig = getStatusBadge(bill.status);

              return (
                <TableRow className="hover:bg-gray-50" key={bill.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {bill.dormer.firstName[0]}
                          {bill.dormer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {bill.dormer.firstName} {bill.dormer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Room {bill.dormer.roomNumber} • {bill.billingPeriod}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(bill.totalAmountDue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bill.billingPeriod}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      {formatCurrency(bill.amountPaid)}
                    </div>
                    {bill.billDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(bill.billDate)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`font-medium ${
                        bill.remainingBalance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatCurrency(bill.remainingBalance)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(bill)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {bill.status !== "Paid" && (
                        <Button
                          size="sm"
                          onClick={() => onRecordPayment(bill)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
