"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dormer } from "../types";
import { Loader2, Trash2 } from "lucide-react";

// --- Type Definitions ---
interface DeleteDormerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dormer: Dormer | null;
  onConfirm: (dormerId: string) => Promise<void>;
}

// --- Component ---
export default function DeleteDormerModal({
  isOpen,
  onClose,
  dormer,
  onConfirm,
}: DeleteDormerModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!dormer) return;

    setIsDeleting(true);
    try {
      await onConfirm(dormer.id);
      toast.success(
        `Dormer "${dormer.firstName} ${dormer.lastName}" has been deleted.`
      );
      onClose();
    } catch (error: any) {
      toast.error(`Failed to delete dormer: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!dormer) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={undefined}>
        <AlertDialogHeader className={undefined}>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Are you sure you want to delete this dormer?
          </AlertDialogTitle>
          <AlertDialogDescription className={undefined}>
            This action cannot be undone. This will permanently delete the
            dormer record for{" "}
            <span className="font-semibold text-gray-800">
              {dormer.firstName} {dormer.lastName}
            </span>{" "}
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={undefined}>
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            className={undefined}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, delete dormer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
