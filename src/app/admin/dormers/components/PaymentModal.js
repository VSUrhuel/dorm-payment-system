"use client";

import { useState } from "react";
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
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handlePayment = async () => {
    // Logic to handle payment submission
    // This could involve updating the bill document in Firestore
    const paymentData = {
      dormerId: dormer.id,
      billId: bill.id,
      amount: amount > bill.totalAmountDue ? bill.totalAmountDue : amount,
      paymentDate: document.getElementById("paymentDate").value,
      paymentMethod: paymentMethod,
      notes: notes,
    };
    onSavePayment(paymentData);
    console.log("Payment submitted for:", dormer, bill);
  };
  if (!dormer || !bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    Billing Period
                  </Label>
                  <p>{bill.billingPeriod}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Due Date</Label>
                  <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Amount Due</Label>
                  <p className="font-medium">
                    ${bill.totalAmountDue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Amount Paid</Label>
                  <p className="font-medium">${bill.amountPaid.toFixed(2)}</p>
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
                placeholder={bill.totalAmountDue.toFixed(2)}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
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
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder="Select method"
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Mobile Payment">
                      Mobile Payment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentNotes">Notes</Label>
              <Textarea
                id="paymentNotes"
                placeholder="e.g., Partial payment for September rent"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePayment}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
