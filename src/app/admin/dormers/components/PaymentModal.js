"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function PaymentModal({
  isOpen,
  onClose,
  dormer,
  bill,
  onSavePayment,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // Effect to set default date when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set the default date to today in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
      setPaymentDate(today);

      // Reset other fields
      setAmount("");
      setNotes("");
      setPaymentMethod("Cash");
    }
  }, [isOpen]);

  const handlePayment = () => {
    const paymentData = {
      dormerId: dormer.id,
      billId: bill.id,
      amount: parseFloat(amount) || 0,
      paymentDate: paymentDate,
      paymentMethod: paymentMethod,
      notes: notes,
    };
    onSavePayment(paymentData);
  };

  const handleClose = () => {
    setAmount("");
    setNotes("");
    onClose();
  };

  if (!dormer || !bill) return null;

  // Calculate the remaining balance to suggest as the payment amount
  const remainingBalance = bill.totalAmountDue - (bill.amountPaid || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* FIX 1: Apply scrolling classes here on DialogContent.
        - `max-h-[90vh]` limits the modal height.
        - `overflow-y-auto` adds a vertical scrollbar only when needed.
      */}
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName?.[0]}
                {dormer.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                {dormer.firstName} {dormer.lastName} • Room {dormer.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">
                Bill Summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">
                    Billing Period
                  </Label>
                  <p className="font-medium">{bill.billingPeriod}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    Remaining Balance
                  </Label>
                  <p className="font-medium text-red-600">
                    ₱{remainingBalance.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    Total Amount Due
                  </Label>
                  <p>₱{bill.totalAmountDue.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Amount Paid</Label>
                  <p>₱{(bill.amountPaid || 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                placeholder={`e.g., ${remainingBalance.toFixed(2)}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  className="mt-1"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                {/* FIX 2: Correctly handle state for the Select component.
                  - `value` and `onValueChange` props are moved to the parent <Select>.
                */}
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="GCash">GCash</SelectItem>
                    <SelectItem value="PayMaya">PayMaya (Maya)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentNotes">Notes (Optional)</Label>
              <Textarea
                id="paymentNotes"
                placeholder="e.g., Partial payment for September"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePayment}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
