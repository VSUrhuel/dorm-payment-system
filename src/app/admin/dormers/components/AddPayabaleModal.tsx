"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { toast } from "sonner";
import { Payable } from "../types";

/**
 * --- Type Definitions ---
 * Defines the shape of the props for the AddPayableModal component.
 */
interface AddPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payableData: Partial<Payable>) => void;
  payable: Payable | null;
}

/**
 * A modal for adding or editing a payable.
 */
export default function AddPayableModal({
  isOpen,
  onClose,
  onSave,
  payable,
}: AddPayableModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = Boolean(payable);

  useEffect(() => {
    if (isOpen && isEditing && payable) {
      setName(payable.name || "");
      setAmount(String(payable.amount) || "");
      setDescription(payable.description || "");
    } else if (isOpen) {
      setName("");
      setAmount("");
      setDescription("");
    }
  }, [isOpen, payable, isEditing]);

  const handleSave = () => {
    if (!name || !amount) {
      toast.info("Title and Amount are required.");
      return;
    }

    const payableData: Partial<Payable> = {
      ...(isEditing && { id: payable?.id }),
      name: name,
      amount: parseFloat(amount),
      description,
    };

    onSave(payableData);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setAmount("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>
            {isEditing ? "Edit Payable" : "Add New Payable"}
          </DialogTitle>
          <DialogDescription className={undefined}>
            {isEditing
              ? "Update the details of this payable."
              : "Fill in the details to add a new payable."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Monthly Rent"
              type={undefined}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 500.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="(Optional) Any details about this payable."
            />
          </div>
        </div>
        <DialogFooter className={undefined}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className={undefined}
            variant={undefined}
            size={undefined}
          >
            {isEditing ? "Update Payable" : "Add Payable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
