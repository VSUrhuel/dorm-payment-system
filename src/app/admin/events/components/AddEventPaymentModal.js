"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { DollarSign, User, Calendar } from "lucide-react";
import { toast } from "sonner";

/**
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * dormer: any;
 * event: any;
 * onSave: (paymentData: any) => void;
 * }} props
 */
export default function AddEventPaymentModal({
  isOpen,
  onClose,
  dormer,
  event,
  currentUser,
  onSave,
}) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!paymentAmount || !paymentMethod || !paymentDate) {
        toast.error("Please fill in all required fields");
        return;
      }

      const amount = Number.parseFloat(paymentAmount);
      if (amount <= 0 || amount > event.amountDue) {
        toast.error(
          `Payment amount must be between ₱0.01 and ₱${event.amountDue.toFixed(
            2
          )}`
        );
        return;
      }

      // Create payment data object
      const paymentData = {
        eventId: event.id,
        dormerId: dormer.id,
        amount: amount,
        paymentMethod: paymentMethod,
        paymentDate: paymentDate,
        notes: paymentNotes,
        recordedBy: {
          name: currentUser.name,
          email: currentUser.email,
          id: currentUser.id,
        },
        createdAt: new Date().toISOString(),
      };

      onSave(paymentData);

      // Reset form
      setPaymentAmount("");
      setPaymentMethod("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentNotes("");
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Failed to save payment. Please try again.");
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setPaymentAmount("");
      setPaymentMethod("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentNotes("");
      onClose();
    }
  };

  if (!dormer || !event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Log Event Payment
          </DialogTitle>
          <DialogDescription>
            Record payment for <strong>{event.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dormer Info */}
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

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Amount *</Label>
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
              <Label htmlFor="paymentDate">Payment Date *</Label>
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
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
                <SelectItem value="paymaya">PayMaya</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentNotes">Notes (Optional)</Label>
            <Textarea
              id="paymentNotes"
              placeholder="Add any additional notes about this payment..."
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
