"use client";

import { useState } from "react"; // 1. Import useState
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

/**
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * onSave: (dormerData: object) => void; // Corrected JSDoc
 * }} props
 */
export default function AddEventModal({ isOpen, onClose, onSave }) {
  // 2. Create state for each form field

  const [name, setname] = useState("");
  const [amountDue, setamountDue] = useState(0);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Create a handler to gather data and call the onSave prop
  const handleSave = () => {
    setIsSubmitting(true);
    if (!name || !amountDue || !description || !dueDate) {
      toast.info("All fields are required.");
      setIsSubmitting(false);
      return;
    }
    const eventData = {
      name,
      amountDue,
      description,
      dueDate,
    };
    onSave(eventData); // Pass the collected data up to the parent
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    // Reset form fields when closing the modal
    setname("");
    setamountDue(0);
    setDescription("");
    setDueDate("");
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
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to register a new event
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              {/* 4. Connect input to state */}
              <Input
                id="name"
                className="mt-1"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amountDue">Event Collectible</Label>
              <Input
                id="amountDue"
                className="mt-1"
                type="number"
                value={amountDue}
                onChange={(e) => setamountDue(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                className="mt-1"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className={`bg-green-600 hover:bg-green-700 text-white ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave} // 5. Use the new handler
            disabled={isSubmitting}
          >
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
