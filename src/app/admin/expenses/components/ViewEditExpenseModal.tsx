"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
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
import { Upload, X, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Expense } from "../types";

interface ViewEditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (updatedExpense: Expense) => void;
  isDormer?: boolean
}

export default function ViewEditExpenseModal({
  isOpen,
  onClose,
  expense,
  onSave,
  isDormer
}: ViewEditExpenseModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Expense | null>(null);
  const [newReceiptFile, setNewReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isOpen && expense) {
      setFormData({ ...expense });
      setReceiptPreview(expense.receiptImageUrl || null);
      setNewReceiptFile(null);
      setIsEditing(false);
      setImgError(false);
    }
  }, [isOpen, expense]);

  const handleInputChange = (field: keyof Expense, value: any) => {
    if (formData) {
      setFormData((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    let updatedExpense = { ...formData };

    try {
      if (newReceiptFile) {
        const filePath = `public/${Date.now()}-${newReceiptFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("receipt-images")
          .upload(filePath, newReceiptFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("receipt-images")
          .getPublicUrl(filePath);
        updatedExpense.receiptImageUrl = data.publicUrl;
      }
      onSave(updatedExpense);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    // revert formData to the original expense, clear any staged file/preview and exit edit mode
    if (expense) {
      setFormData({ ...expense });
      setReceiptPreview(expense.receiptImageUrl || null);
    } else {
      setFormData(null);
      setReceiptPreview(null);
    }
    setNewReceiptFile(null);
    setIsEditing(false);
    setImgError(false);
  };

  if (!isOpen || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>
            {isEditing ? "Edit Expense" : "Expense Details"}
          </DialogTitle>
          <DialogDescription className={undefined}>
            {isEditing
              ? "Update the details for this expense."
              : `Viewing details for expense: ${expense.title}`}
          </DialogDescription>
        </DialogHeader>

        {/* Replaced <form> with a <div> to prevent accidental submissions */}
        <div className="py-4 space-y-4">
          {/* Receipt Image Section */}
          <div className="space-y-2">
            <Label className={undefined}>Receipt</Label>
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
                      className={undefined}
                      size={undefined}
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
              <Label htmlFor="title" className={undefined}>
                Title {isEditing && <span className="text-xs text-gray-500">({formData.title.length}/100)</span>}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={!isEditing}
                maxLength={100}
                className="disabled:opacity-100 disabled:cursor-default"
                type={undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className={undefined}>
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={!isEditing}
              >
                <SelectTrigger className="disabled:opacity-100 disabled:cursor-default">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className={undefined}>
                  <SelectItem value="Utilities" className={undefined}>
                    Utilities
                  </SelectItem>
                  <SelectItem value="Maintenance" className={undefined}>
                    Maintenance
                  </SelectItem>
                  <SelectItem value="Supplies" className={undefined}>
                    Supplies
                  </SelectItem>
                  <SelectItem value="Security" className={undefined}>
                    Security
                  </SelectItem>
                  <SelectItem value="Other" className={undefined}>
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className={undefined}>
                Amount (₱)
              </Label>
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
              <Label htmlFor="expenseDate" className={undefined}>
                Expense Date
              </Label>
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
              <Label htmlFor="description" className={undefined}>
                Description {isEditing && <span className="text-xs text-gray-500">({formData.description.length}/500)</span>}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={!isEditing}
                maxLength={500}
                className="disabled:opacity-100 disabled:cursor-default min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className={undefined}>
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className={undefined}
                  size={undefined}
                >
                  Cancel
                </Button>
                {/* This button now explicitly calls handleSubmit on click */}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={undefined}
                  variant={undefined}
                  size={undefined}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className={undefined}
                  size={undefined}
                >
                  Close
                </Button>
                {isDormer ? '' : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={undefined}
                    variant={undefined}
                    size={undefined}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
