"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { DollarSign, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Event, EventDormerData } from "../types";
import { User as FirebaseUser } from "firebase/auth";

// --- Type Definitions ---
interface AddEventPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormer: EventDormerData | null;
  event: Event | null;
  currentUser:
    | {
        name: string;
        email: string | null;
        id: string;
        uid: string;
      }
    | FirebaseUser
    | null;
  onSave: (paymentData: any) => void;
}

// --- Component ---
export default function AddEventPaymentModal({
  isOpen,
  onClose,
  dormer,
  event,
  currentUser,
  onSave,
}: AddEventPaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentAmount("");
      setPaymentMethod("cash");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentNotes("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!paymentAmount || !paymentMethod || !paymentDate || !event) {
        toast.error("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      const amount = Number.parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0 || amount > event.amountDue) {
        toast.error(
          `Payment amount must be between ₱0.01 and ₱${event.amountDue.toFixed(
            2
          )}`
        );
        setIsSubmitting(false);
        return;
      }

      const paymentData = {
        eventId: event.id,
        dormerId: dormer?.id,
        amount: amount,
        paymentMethod: paymentMethod,
        paymentDate: paymentDate,
        notes: paymentNotes,
        recordedBy: {
          name:
            (currentUser as any)?.name ||
            (currentUser as FirebaseUser)?.displayName ||
            "Admin",
          email: currentUser?.email,
          id: currentUser?.uid,
        },
        createdAt: new Date().toISOString(),
      };

      await onSave(paymentData);
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Failed to save payment. Please try again.");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!dormer || !event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className={undefined}>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Log Event Payment
          </DialogTitle>
          <DialogDescription className={undefined}>
            Record payment for <strong>{event.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                Dormer Information
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">
                  {dormer.firstName} {dormer.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Room:</span>
                <span className="font-medium">{dormer.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Due:</span>
                <span className="font-medium text-green-600">
                  ₱{event.amountDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount" className={undefined}>
                Amount *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₱
                </span>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  max={event.amountDue}
                  placeholder="0.00"
                  className="pl-8"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate" className={undefined}>
                Payment Date *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="paymentDate"
                  type="date"
                  className="pl-10"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className={undefined}>
              Payment Method *
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className={undefined}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="cash" className={undefined}>
                  Cash
                </SelectItem>
                <SelectItem value="gcash" className={undefined}>
                  GCash
                </SelectItem>
                <SelectItem value="paymaya" className={undefined}>
                  PayMaya
                </SelectItem>
                <SelectItem value="bank-transfer" className={undefined}>
                  Bank Transfer
                </SelectItem>
                <SelectItem value="check" className={undefined}>
                  Check
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentNotes" className={undefined}>
              Notes (Optional) <span className="text-xs text-gray-500">({paymentNotes.length}/500)</span>
            </Label>
            <Textarea
              id="paymentNotes"
              placeholder="Add any additional notes..."
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              maxLength={500}
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter className={undefined}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className={undefined}
              size={undefined}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
              variant={undefined}
              size={undefined}
            >
              {isSubmitting ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
