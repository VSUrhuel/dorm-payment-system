"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { Dormer, Bill } from "../types";

// --- Type Definitions ---
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormer: Dormer | null;
  bill: Bill | null;
  onSavePayment: (paymentData: any) => Promise<void>;
}

// --- Component ---
export default function PaymentModal({
  isOpen,
  onClose,
  dormer,
  bill,
  onSavePayment,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setPaymentDate(today);

      setAmount("");
      setNotes("");
      setPaymentMethod("Cash");
    }
  }, [isOpen]);

  const handlePayment = () => {
    if (!dormer || !bill) return;

    const paymentData = {
      dormerId: dormer.id,
      dormerDetails: {
        firstName: dormer.firstName,
        lastName: dormer.lastName,
        roomNumber: dormer.roomNumber,
        email: dormer.email,
      },
      billId: bill.id,
      amount: parseFloat(amount) || 0,
      paymentDate: paymentDate,
      paymentMethod: paymentMethod,
      notes: notes,
    };
    setLoading(true);
    onSavePayment(paymentData).finally(() => {
      setLoading(false);
    });
  };

  const handleClose = () => {
    setAmount("");
    setNotes("");
    onClose();
  };

  if (!dormer || !bill) return null;

  const remainingBalance = bill.totalAmountDue - (bill.amountPaid || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={undefined}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName?.[0]}
                {dormer.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className={undefined}>Record Payment</DialogTitle>
              <DialogDescription className={undefined}>
                {dormer.firstName} {dormer.lastName} • Room {dormer.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className={undefined}>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">
                Bill Summary
              </CardDescription>
            </CardHeader>
            <CardContent className={undefined}>
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

          <Separator className={undefined} />

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount" className={undefined}>
                Payment Amount
              </Label>
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
                <Label htmlFor="paymentDate" className={undefined}>
                  Payment Date
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  className="mt-1"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod" className={undefined}>
                  Payment Method
                </Label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className={undefined}>
                    <SelectItem value="Cash" className={undefined}>
                      Cash
                    </SelectItem>
                    <SelectItem value="Bank Transfer" className={undefined}>
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value="GCash" className={undefined}>
                      GCash
                    </SelectItem>
                    <SelectItem value="PayMaya" className={undefined}>
                      PayMaya (Maya)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentNotes" className={undefined}>
                Notes (Optional)
              </Label>
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

        <DialogFooter className={undefined}>
          <Button
            variant="outline"
            onClick={handleClose}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePayment}
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            variant={undefined}
            size={undefined}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
