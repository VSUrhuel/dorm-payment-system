"use client";

import React from "react";
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
import { CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dormer } from "../../dormers/types";
import { PaymentFines } from "../types";
import { getStatusBadgeInfo } from "../../dormers/utils/badgeUtils";
import { formatDate } from "../formatDate";

interface FinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormer: (Dormer & { fines: PaymentFines[] }) | null;
  onRecordPayment: (fine: PaymentFines) => void;
}

export default function FinesModal({
  isOpen,
  onClose,
  dormer,
  onRecordPayment,
}: FinesModalProps) {
  if (!dormer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={undefined}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-red-100 text-red-800">
                {dormer.firstName?.[0]}
                {dormer.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className={undefined}>
                {dormer.firstName} {dormer.lastName} - Fines
              </DialogTitle>
              <DialogDescription className={undefined}>
                Room {dormer.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 overflow-x-auto">
          <Tabs defaultValue="fines" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fines" className={undefined}>
                Fines
              </TabsTrigger>
              <TabsTrigger value="details" className={undefined}>
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="fines"
              className="py-4 max-h-[60vh] overflow-y-auto"
            >
              <Table className={undefined}>
                <TableHeader className={undefined}>
                  <TableRow className={undefined}>
                    <TableHead className={undefined}>Date Recorded</TableHead>
                    <TableHead className={undefined}>Amount Due</TableHead>
                    <TableHead className={undefined}>Amount Paid</TableHead>
                    <TableHead className={undefined}>Date Paid</TableHead>
                    <TableHead className={undefined}>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={undefined}>
                  {dormer.fines.map((fine) => {
                    const { className, Icon } = getStatusBadgeInfo(fine.status);
                    return (
                      <TableRow key={fine.id} className={undefined}>
                        <TableCell className="w-[150px]">
                          <span className="truncate block" title={fine.createdAt.toDate().toString()}>
                            {formatDate(fine.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          ₱{fine.totalAmountDue.toFixed(2)}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          ₱{(fine.amountPaid || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="w-[120px]">
                          {fine.paymentDate ? <span className="truncate block" title={fine.paymentDate.toDate().toString()}>
                            {formatDate(fine.paymentDate)}
                          </span> : "-"}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <Badge className={className} variant={undefined}>
                            {Icon && <Icon className="h-4 w-4 mr-1 flex-shrink-0" />}
                            <span className="truncate">{fine.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right w-[120px]">
                          {(fine.status === "Unpaid" ||
                            fine.status === "Partially Paid") && (
                            <Button
                              size="sm"
                              onClick={() => onRecordPayment(fine)}
                              className="h-8 bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
                              variant={undefined}
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
                <Card className={undefined}>
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

                <Card className={undefined}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Dormitory Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">
                        Room Number
                      </Label>
                      <p>{dormer.roomNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Date Added
                      </Label>
                      <p>
                        {dormer.createdAt
                          ? new Date(
                              dormer.createdAt.seconds * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
