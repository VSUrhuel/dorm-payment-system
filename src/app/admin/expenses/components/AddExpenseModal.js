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
import { Upload, X } from "lucide-react";
import { serverTimestamp } from "firebase/firestore";
import { supabase } from "@/lib/supabaseClient";

/**
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * onSave: (expenseData: any) => void;
 * }} props
 */
export default function AddExpenseModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    expenseDate: "",
    category: "",
    receiptImage: null,
  });
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        receiptImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setFormData((prev) => ({
      ...prev,
      receiptImage: null,
    }));
    setReceiptPreview(null);
  };

  // This is the only function that needs changes.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields first
    if (
      !formData.title ||
      !formData.amount ||
      !formData.expenseDate ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let receiptImageUrl = null;

      // --- SUPABASE UPLOAD LOGIC ---
      // 1. Check if a receipt image file exists
      if (formData.receiptImage) {
        const file = formData.receiptImage;
        // 2. Create a unique file path to avoid overwriting files
        const filePath = `public/${Date.now()}-${file.name}`;

        // 3. Upload the file to your Supabase Storage bucket
        //    NOTE: Ensure you have a bucket named 'receipts' in your Supabase project.
        const { error: uploadError } = await supabase.storage
          .from("receipt-images") // Your bucket name
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError; // Throw an error if upload fails
        }

        // 4. If upload is successful, get the public URL for the file
        const { data } = supabase.storage
          .from("receipt-images") // Your bucket name
          .getPublicUrl(filePath);

        receiptImageUrl = data.publicUrl;
      }

      // Create the final expense data object with the image URL
      const expenseData = {
        title: formData.title,
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        category: formData.category,
        receiptImageUrl: receiptImageUrl, // Use the URL from Supabase
      };

      onSave(expenseData); // Pass the final data to the parent
      handleClose(); // Close and reset the modal on success
    } catch (error) {
      console.error("Error saving expense:", error);
      alert(`Failed to save expense: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        amount: "",
        expenseDate: "",
        category: "",
        receiptImage: null,
      });
      setReceiptPreview(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense for the dormitory. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Dorm Cleaning Materials"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about this expense..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
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
              <Label htmlFor="expenseDate">Expense Date *</Label>
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
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt Image</Label>
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
              {isSubmitting ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
