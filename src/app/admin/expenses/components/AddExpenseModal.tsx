"use client";

import { useEffect, useState } from "react";
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
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../../lib/supabaseClient";
import { Expense } from "../types";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    expenseData: Omit<Expense, "id" | "recordedBy" | "createdAt">
  ) => void;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    category: "",
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setFormData({
        title: "",
        description: "",
        amount: "",
        expenseDate: new Date().toISOString().split("T")[0],
        category: "",
      });
      setReceiptFile(null);
      setReceiptPreview(null);
    }
  }, [isOpen]);

  const handleInputChange = (
    eOrId: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    maybeValue?: string
  ) => {
    if (typeof eOrId === "string") {
      const id = eOrId;
      const value = maybeValue ?? "";
      setFormData((prev) => ({ ...prev, [id]: value }));
      return;
    }
    const e = eOrId;
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) {
      toast.info("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let receiptImageUrl: string | null = null; // Changed to null
      if (receiptFile) {
        const filePath = `public/${Date.now()}-${receiptFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("receipt-images")
          .upload(filePath, receiptFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("receipt-images")
          .getPublicUrl(filePath);
        receiptImageUrl = data.publicUrl;
      }

      onSave({
        title: formData.title,
        description: formData.description,
        expenseDate: formData.expenseDate,
        category: formData.category as Expense["category"],
        amount: parseFloat(formData.amount),
        receiptImageUrl: receiptImageUrl || null, // Ensure it's null, not undefined
      });
      onClose();
    } catch (error: any) {
      toast.error(`Failed to save expense: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add New Expense</DialogTitle>
          <DialogDescription className={undefined}>
            Record a new expense for the dormitory. Fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className={undefined}>
              Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Dorm Cleaning Materials"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border-gray-300"
              required
              type={undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={undefined}>
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide details about this expense..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="space-y-2">
              <Label htmlFor="amount" className={undefined}>
                Amount *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₱
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="border-gray-300 pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDate" className={undefined}>
                Expense Date *
              </Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) =>
                  handleInputChange("expenseDate", e.target.value)
                }
                className="border-gray-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className={undefined}>
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="Utilities" className={undefined}>
                  Utilities
                </SelectItem>
                <SelectItem value="Maintenance" className={undefined}>
                  Maintenance
                </SelectItem>
                <SelectItem value="Security" className={undefined}>
                  Security
                </SelectItem>
                <SelectItem value="Supplies" className={undefined}>
                  Supplies
                </SelectItem>
                <SelectItem value="Other" className={undefined}>
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt" className={undefined}>
              Receipt Image
            </Label>
            {!receiptPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload receipt image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("receipt-upload").click()
                  }
                  className="border-gray-300"
                >
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="relative border rounded-lg overflow-hidden">
                <img
                  src={receiptPreview || "/placeholder.svg"}
                  alt="Receipt preview"
                  className="w-full h-32 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeReceipt}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
              {isSubmitting ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
