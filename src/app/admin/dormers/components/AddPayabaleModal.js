"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./../../../../components/ui/dialog";
import { Button } from "./../../../../components/ui/button";
import { Input } from "./../../../../components/ui/input";
import { Label } from "./../../../../components/ui/label";
import { Textarea } from "./../../../../components/ui/textarea"; // Using Textarea for description is better
import { toast } from "sonner";

/**
 * A modal for adding or editing a payable.
 *
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {function} onSave - Function to call with the payable data when saving.
 * @param {object|null} payable - The payable object to edit. If null, the modal is in "add" mode.
 */
export default function AddPayableModal({ isOpen, onClose, onSave, payable }) {
  // State for the form fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = Boolean(payable);

  // When the 'payable' prop changes (i.e., when opening to edit),
  // populate the form fields with its data.
  useEffect(() => {
    if (isOpen && isEditing) {
      setTitle(payable.name || "");
      setAmount(payable.amount || "");
      setDescription(payable.description || "");
    } else if (isOpen) {
      setTitle("");
      setAmount("");
      setDescription("");
    }
  }, [isOpen, payable, isEditing]); // Rerun effect when the payable or open state changes

  const handleSave = () => {
    // Basic validation
    if (!title || !amount) {
      toast.info("Title and Amount are required.");
      return;
    }

    // Construct the payable data object
    const payableData = {
      ...(isEditing && { id: payable.id }),
      name: title,
      amount: parseFloat(amount), // Ensure amount is a number
      description,
    };

    // Call the onSave prop from the parent with the data
    onSave(payableData);
    onClose(); // Close the modal after saving
  };

  const handleClose = () => {
    // Reset form fields when closing the modal
    setTitle("");
    setAmount("");
    setDescription("");
    onClose(); // Call the parent's onClose function
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Payable" : "Add New Payable"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this payable."
              : "Fill in the details to add a new payable."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Monthly Rent"
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEditing ? "Update Payable" : "Add Payable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
