"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const generateBillingPeriods = () => {
  const periods = [];
  // 1. Added parentheses for clarity and standard practice
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + i,
      1
    );

    const year = date.getFullYear();
    // Format month for the 'value' (e.g., "2025-08")
    const monthValue = (date.getMonth() + 1).toString().padStart(2, "0");

    // 2. Format a human-readable label (e.g., "August 2025")
    const monthLabel = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    periods.push({
      value: `${year}-${monthValue}`,
      label: monthLabel, // 3. Use the descriptive label here
    });
  }
  return periods;
};

/**
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * dormer: any;
 * }} props
 */
export default function GenerateBillModal({
  isOpen,
  onClose,
  dormer,
  onGenerateBill,
  payables,
}) {
  const [selectedPayables, setSelectedPayables] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState("");

  const billingPeriods = generateBillingPeriods();

  // // Recalculate total amount whenever the user checks/unchecks a payable
  useEffect(() => {
    const newTotal = payables.reduce((sum, payable) => {
      return selectedPayables[payable.id] ? sum + payable.amount : sum;
    }, 0);
    setTotalAmount(newTotal);
  }, [selectedPayables]);

  // // Reset state when the modal is closed or the dormer changes,
  // // and set a default billing period when it opens.
  useEffect(() => {
    if (isOpen) {
      setSelectedPayables({});
      setTotalAmount(0);
      setBillingPeriod(billingPeriods[0]?.value || "");
    }
  }, [isOpen, dormer]);

  const handlePayableChange = (payableId) => {
    setSelectedPayables((prev) => ({
      ...prev,
      [payableId]: !prev[payableId],
    }));
  };

  const handleBillingPeriodChange = (value) => {
    console.log("Selected billing period:", value);
    setBillingPeriod(value);
  };

  if (!dormer) return null;

  const handleGenerateBill = () => {
    if (!billingPeriod) {
      toast.info("Please select a billing period.");
      return;
    }
    if (totalAmount <= 0) {
      toast.info("Please select at least one payable to generate a bill.");
      return;
    }
    // Logic to generate the bill would go here
    const billData = {
      dormerId: dormer.id,
      billingPeriod,
      status: "Unpaid",
      totalAmountDue: totalAmount,
      description: document.getElementById("description").value || "",
      amountPaid: 0,
    };
    onGenerateBill(billData);
    onClose(); // Close the modal after generating the bill
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Generate New Bill</DialogTitle>
              <DialogDescription>
                {dormer.firstName} {dormer.lastName} • Room {dormer.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingPeriod">Billing Period</Label>
              <Select
                value={billingPeriod}
                onValueChange={handleBillingPeriodChange}
              >
                <SelectTrigger id="billingPeriod" className="mt-1">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  {billingPeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="payables" className="text-base font-semibold">
                Payables
              </Label>
              <div className="text-right">
                <p className="text-xs text-gray-500">Running Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₱{totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-2 p-4 border rounded-lg bg-slate-50">
              {payables.map((payable) => (
                <div
                  key={payable.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={payable.id}
                      checked={!!selectedPayables[payable.id]}
                      onCheckedChange={() => handlePayableChange(payable.id)}
                    />
                    <Label
                      htmlFor={payable.id}
                      className="font-normal text-sm cursor-pointer"
                    >
                      {payable.name}
                    </Label>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    ₱{payable.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Total Bill Amount</Label>
            <Input
              id="amount"
              type="text"
              value={`₱ ${totalAmount.toFixed(2)}`}
              readOnly
              className="mt-1 bg-gray-100 font-semibold text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="description">Description / Notes</Label>
            <Textarea
              id="description"
              placeholder="e.g., Monthly charges for September, including maintenance and WiFi."
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleGenerateBill}
          >
            Generate Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
