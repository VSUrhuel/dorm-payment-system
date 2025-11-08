"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
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
import { toast } from "sonner";
import { Textarea } from "../../../../components/ui/textarea";

interface EventData {
  name: string;
  amountDue: number;
  description: string;
  dueDate: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventData) => void;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
}: AddEventModalProps) {
  const [name, setName] = useState("");
  const [amountDue, setAmountDue] = useState(0);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset form when modal is opened
    if (isOpen) {
      setName("");
      setAmountDue(0);
      setDescription("");
      setDueDate("");
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSubmitting(true);
    if (!name || !amountDue || !description || !dueDate) {
      toast.info("All fields are required.");
      setIsSubmitting(false);
      return;
    }
    const eventData: EventData = {
      name,
      amountDue,
      description,
      dueDate,
    };
    onSave(eventData);
    handleClose(); // handleClose will also set isSubmitting to false if needed
  };

  const handleClose = () => {
    setIsSubmitting(false);
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
          <DialogTitle className={undefined}>Add New Event</DialogTitle>
          <DialogDescription className={undefined}>
            Fill in the details to register a new event
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className={undefined}>
                Event Name
              </Label>
              <Input
                id="name"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type={undefined}
              />
            </div>
            <div>
              <Label htmlFor="description" className={undefined}>
                Description
              </Label>
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
              <Label htmlFor="amountDue" className={undefined}>
                Event Collectible
              </Label>
              <Input
                id="amountDue"
                className="mt-1"
                type="number"
                value={amountDue}
                onChange={(e) => setAmountDue(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="dueDate" className={undefined}>
                Due Date
              </Label>
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

        <DialogFooter className={undefined}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-gray-300 hover:bg-gray-50"
            size="default"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#2E7D32] hover:bg-[#A5D6A7] text-white font-semibold transition-all"
            onClick={handleSave}
            disabled={isSubmitting}
            variant="default"
            size="default"
          >
            {isSubmitting ? "Saving..." : "Save Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
