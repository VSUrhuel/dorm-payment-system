import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { Dormitory } from "../types";

interface DeleteDormitoryProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (dormitory: Dormitory) => void;
    dormitory: Dormitory;
}

export default function DeleteDormitory({ isOpen, onClose, onDelete, dormitory }: DeleteDormitoryProps) {
     return (<Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] border-neutral-200">
          <DialogHeader className={undefined}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold text-neutral-900">Remove Dormitory</DialogTitle>
            <DialogDescription className="text-center pt-2 text-[15px] text-neutral-600">
              Are you sure you want to remove <span className="font-semibold text-neutral-900">"{dormitory?.name}"</span>?
              This action will unassign all residents and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent" size={undefined}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => onDelete(dormitory)} className="w-full sm:w-auto" size={undefined}>
              Confirm Deletion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>)
}