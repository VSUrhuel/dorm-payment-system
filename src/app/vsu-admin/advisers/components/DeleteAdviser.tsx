"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dormer } from "@/app/admin/dormers/types"
import { AlertTriangle } from "lucide-react"

interface DeleteAdviserProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (adviserId: string) => void;
    adviser: Dormer | null;
}

export default function DeleteAdviser({ isOpen, onClose, onDelete, adviser }: DeleteAdviserProps) {
    if (!adviser) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className={undefined}>
                    <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Remove Adviser
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-gray-600">
                        Are you sure you want to remove <span className="font-bold">"{adviser.firstName} {adviser.lastName}"</span> from the adviser registry? This will mark them as inactive.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="hover:bg-gray-100"
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onDelete(adviser.id);
                            onClose();
                        }}
                        className=""
                        size="sm"
                    >
                        Confirm Removal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
