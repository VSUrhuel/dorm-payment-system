"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Your Supabase client

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
import { Upload, X, Edit, Loader2 } from "lucide-react";

/**
 * A modal for viewing and editing expense details.
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * expense: object | null;
 * onSave: (updatedExpense: object) => void;
 * }} props
 */
export default function ViewEditExpenseModal({
  isOpen,
  onClose,
  expense,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [newReceiptFile, setNewReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Effect to reset state when the modal is opened or the expense changes
  useEffect(() => {
    if (isOpen && expense) {
      setFormData({ ...expense });
      setReceiptPreview(expense.receiptImageUrl || null);
      setNewReceiptFile(null);
      setIsEditing(false);
      setImgError(false);
    }
  }, [isOpen, expense]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data back to original expense
    setFormData({ ...expense });
    setReceiptPreview(expense.receiptImageUrl || null);
    setNewReceiptFile(null);
  };

  // The submission handler no longer needs the event parameter
  const handleSubmit = async () => {
    setIsSubmitting(true);
    let updatedExpense = { ...formData };

    try {
      // If a new receipt file was selected, upload it
      if (newReceiptFile) {
        const file = newReceiptFile;
        const filePath = `public/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("receipt-images") // Using more specific bucket name
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("receipt-images")
          .getPublicUrl(filePath);

        updatedExpense.receiptImageUrl = urlData.publicUrl;
      }

      // Call the onSave prop with the updated data
      await onSave(updatedExpense);

      setIsEditing(false); // Switch back to view mode on success
    } catch (error) {
      console.error("Failed to save expense:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Expense" : "Expense Details"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this expense."
              : `Viewing details for expense: ${expense.title}`}
          </DialogDescription>
        </DialogHeader>

        {/* Replaced <form> with a <div> to prevent accidental submissions */}
        <div className="py-4 space-y-4">
          {/* Receipt Image Section */}
          <div className="space-y-2">
            <Label>Receipt</Label>
            {isEditing ? (
              // EDITING - Image Upload
              <div>
                {receiptPreview ? (
                  <div className="relative">
                    <Image
                      src={receiptPreview}
                      alt="Receipt Preview"
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => {
                        setNewReceiptFile(null);
                        setReceiptPreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          receiptImageUrl: null,
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="receipt-edit-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("receipt-edit-upload").click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload Image
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // VIEWING - Display Image
              <div>
                {receiptPreview && !imgError ? (
                  <Image
                    src={receiptPreview}
                    alt="Expense Receipt"
                    width={800}
                    height={400}
                    className="w-full h-auto max-h-80 object-contain rounded-md border"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-sm text-center text-gray-500 p-4 border rounded-md">
                    No receipt image available.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="disabled:opacity-100 disabled:cursor-default">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDate">Expense Date</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) =>
                  handleInputChange("expenseDate", e.target.value)
                }
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={!isEditing}
                className="disabled:opacity-100 disabled:cursor-default min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {/* This button now explicitly calls handleSubmit on click */}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
