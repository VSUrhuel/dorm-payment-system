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
import { CreditCard, CheckCircle, Clock, Calendar } from "lucide-react";

/**
 * @param {{
 * dormers: any[];
 * onLogPayment: (dormer: any) => void;
 * eventAmount: number;
 * }} props
 */
export default function EventDormersTable({
  dormers,
  onLogPayment,
  eventAmount,
}) {
  const getStatusBadge = (status) => {
    const statusConfig = {
      Paid: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle,
        variant: "default",
      },
      Unpaid: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: Clock,
        variant: "destructive",
      },
      Partial: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        variant: "warning",
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
        <CardTitle className="text-lg font-semibold">
          Dormer Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dormer</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Payment Date
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Recorded By
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dormers.map((dormer) => {
              const statusConfig = getStatusBadge(dormer.paymentStatus);
              const StatusIcon = statusConfig.icon;

              return (
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
                        <div className="font-medium">
                          {dormer.firstName} {dormer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Room {dormer.roomNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(dormer.amountPaid)}
                    </div>

                    {dormer.paymentStatus === "Partial" && (
                      <div className="text-xs text-yellow-600">
                        Remaining:{" "}
                        {formatCurrency(eventAmount - dormer.amountPaid)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {dormer.paymentStatus}
                    </Badge>
                    {dormer.paymentMethod && (
                      <div className="text-xs text-gray-500 mt-1">
                        {dormer.paymentMethod[0].toUpperCase()}
                        {dormer.paymentMethod.slice(1).toLowerCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dormer.paymentDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(dormer.paymentDate)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Not paid</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {dormer.recordedBy ? (
                      <div>
                        <div className="text-sm font-medium">
                          {dormer.recordedBy.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dormer.recordedBy.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {dormer.paymentStatus != "Paid" ? (
                      <Button
                        size="sm"
                        onClick={() => onLogPayment(dormer)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Log Payment
                      </Button>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
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
