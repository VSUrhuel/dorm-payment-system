"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Dormer, Payable, Bill } from "../types";
import { generateBillingPeriods } from "../utils/generateBillUtils";

// --- Type Definitions ---
interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormer: Dormer | null;
  onGenerateBill: (billData: any) => void;
  payables: Payable[];
  bills: Bill[]; // Pass all bills to check for duplicates
  setShowConfirmDialog: (show: boolean) => void;
  setShowErrorModal: (show: boolean) => void;
  setBillToCreate: (bill: any) => void;
}

// --- Component ---
export default function GenerateBillModal({
  isOpen,
  onClose,
  dormer,
  onGenerateBill,
  payables,
  bills,
  setShowConfirmDialog,
  setShowErrorModal,
  setBillToCreate,
}: GenerateBillModalProps) {
  const [selectedPayables, setSelectedPayables] = useState<
    Record<string, boolean>
  >({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState("");
  const [description, setDescription] = useState("");

  const billingPeriods = useMemo(() => generateBillingPeriods(), []);

  useEffect(() => {
    const newTotal = payables.reduce((sum, payable) => {
      return selectedPayables[payable.id] ? sum + payable.amount : sum;
    }, 0);
    setTotalAmount(newTotal);
  }, [selectedPayables, payables]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPayables({});
      setTotalAmount(0);
      setDescription("");
      if (billingPeriods.length > 0) {
        setBillingPeriod(billingPeriods[0].value);
      }
    }
  }, [isOpen, dormer, billingPeriods]);

  const handlePayableChange = (payableId: string) => {
    setSelectedPayables((prev) => ({
      ...prev,
      [payableId]: !prev[payableId],
    }));
  };

  if (!dormer) return null;

  const findExistingBillId = (dormerId: string, billingPeriod: string) => {
    const existingBill = bills.find(
      (bill) =>
        bill.dormerId === dormerId && bill.billingPeriod === billingPeriod
    );
    return existingBill ? existingBill.id : null;
  };

  const alreadyPaidBill = (dormerId: string, billingPeriod: string) => {
    const existingBill = bills.find(
      (bill) =>
        bill.dormerId === dormerId &&
        bill.billingPeriod === billingPeriod &&
        (bill.status === "Paid" || bill.status === "Partially Paid")
    );
    return !!existingBill;
  };

  const handleGenerateBill = () => {
    if (!billingPeriod) {
      toast.info("Please select a billing period.");
      return;
    }
    if (totalAmount <= 0) {
      toast.info("Please select at least one payable to generate a bill.");
      return;
    }
    if (dormer.id === undefined || dormer.id === null) {
      toast.error("Dormer ID is undefined.");
      return;
    }

    const billData = {
      dormerId: dormer.id,
      billingPeriod,
      status: "Unpaid" as Bill["status"],
      totalAmountDue: totalAmount,
      description: description,
      amountPaid: 0,
    };

    if (alreadyPaidBill(billData.dormerId, billData.billingPeriod)) {
      setShowErrorModal(true);
      return;
    }

    const existingBillId = findExistingBillId(
      billData.dormerId,
      billData.billingPeriod
    );

    if (existingBillId) {
      setBillToCreate({ ...billData, id: existingBillId });
      setShowConfirmDialog(true);
    } else {
      onGenerateBill(billData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
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
              <DialogTitle className={undefined}>Generate New Bill</DialogTitle>
              <DialogDescription className={undefined}>
                {dormer.firstName} {dormer.lastName} • Room {dormer.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="billingPeriod" className={undefined}>
              Billing Period
            </Label>
            <Select value={billingPeriod} onValueChange={setBillingPeriod}>
              <SelectTrigger id="billingPeriod" className="mt-1">
                <SelectValue placeholder="Select a period" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                {billingPeriods.map((period) => (
                  <SelectItem
                    key={period.value}
                    value={period.value}
                    className={undefined}
                  >
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className={undefined} />

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
                      className={undefined}
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
            <Label htmlFor="amount" className={undefined}>
              Total Bill Amount
            </Label>
            <Input
              id="amount"
              type="text"
              value={`₱ ${totalAmount.toFixed(2)}`}
              readOnly
              className="mt-1 bg-gray-100 font-semibold text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="description" className={undefined}>
              Description / Notes <span className="text-xs text-gray-500">({description.length}/500)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Monthly charges for October, including maintenance and WiFi."
              className="mt-1"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter className={undefined}>
          <Button
            variant="outline"
            onClick={onClose}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleGenerateBill}
            variant={undefined}
            size={undefined}
          >
            Generate Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
