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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function BillsModal({
  isOpen,
  onClose,
  dormer,
  onRecordPayment,
}) {
  if (!dormer) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return {
          className: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "Unpaid":
        return {
          className: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "Partially Paid":
        return {
          className: "bg-blue-100 text-blue-800",
          icon: <DollarSign className="h-4 w-4 mr-1" />,
        };
      case "Overdue":
        return {
          className: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          icon: null,
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>
                {dormer.firstName} {dormer.lastName}
              </DialogTitle>
              <DialogDescription>Room {dormer.roomNumber}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="bills" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent
            value="bills"
            className="py-4 max-h-[60vh] overflow-y-auto"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dormer.bills.map((bill) => {
                  const status = getStatusBadge(bill.status);
                  return (
                    <TableRow key={bill.billId}>
                      <TableCell>{bill.billingPeriod}</TableCell>
                      <TableCell>${bill.totalAmountDue.toFixed(2)}</TableCell>
                      <TableCell>${bill.amountPaid.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={status.className}>
                          {status.icon}
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(bill.status === "Unpaid" ||
                          bill.status === "Partially Paid" ||
                          bill.status === "Overdue") && (
                          <Button
                            size="sm"
                            onClick={() => onRecordPayment(bill)}
                            className="h-8"
                          >
                            <CreditCard className="h-4 w-4 mr-1" /> Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="details" className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p>{dormer.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p>{dormer.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Dormitory Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Room Number</Label>
                    <p>{dormer.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Date Added</Label>
                    <p>
                      {new Date(dormer.createdAt.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge
                      className={
                        dormer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {dormer.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
