import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dormitory } from "../types";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, MapPin, User, Info, AlertTriangle } from "lucide-react"
import { Dormer, ModalType } from "@/app/admin/dormers/types";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AddEditDormitoryProps {
    isOpen: boolean;
    onClose: () => void;
    dormitory: Dormitory;
    type: ModalType;
    onAdd: (dormitory: Dormitory) => void;
    onUpdate: (dormitory: Dormitory) => void;
    advisers: Dormer[];
}

export default function AddEditDormitory({ isOpen, onClose, dormitory, type, onAdd, onUpdate, advisers }: AddEditDormitoryProps) {
  if(type=="edit" && dormitory == null) {
    toast.error("Dormitory not found!")
    onClose()
    return
  }
  const [dormitoryName, setDormitoryName] = useState(dormitory?.name || "")
  const [dormitoryLocation, setDormitoryLocation] = useState(dormitory?.location || "")
  const [dormitoryAdviser, setDormitoryAdviser] = useState(dormitory?.adviser || "")
  useEffect(() => {
    if (isOpen) {
      setDormitoryName(dormitory?.name || "");
      setDormitoryLocation(dormitory?.location || "");
      setDormitoryAdviser(dormitory?.adviser || "");
    }
  }, [dormitory, isOpen]);
    
  const handleSave = () => {
    if(dormitoryName === "" || dormitoryLocation === "") {
      toast.error("Please fill in all fields!")
      return
    }
    
    if(type === "add") {  
      onAdd({
        id: "",
        name: dormitoryName,
        location: dormitoryLocation,
        adviser: dormitoryAdviser,
      })
    } else {
      onUpdate({
        id: dormitory.id,
        name: dormitoryName,
        location: dormitoryLocation,
        adviser: dormitoryAdviser
      })
    }
    onClose()
  }
  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-neutral-200">
        <DialogHeader className={undefined}>
          <DialogTitle className="text-xl font-semibold text-neutral-900 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-neutral-700" />
            </div>
            {type === "add" ? "Add New Dormitory" : "Edit Dormitory Details"}
          </DialogTitle>
          <DialogDescription className={undefined}>
            {type === "add"
              ? "Complete the form below to add a new building to the university dormitory registry."
              : "Update the building information and status for the dormitory registry."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-1.5">
            <Label
              htmlFor="name"
              className="text-[13px] font-medium text-neutral-700 flex items-center gap-1.5"
            >
              <Building2 className="h-3.5 w-3.5 text-neutral-400" />
              Building Name
            </Label>
            <Input
               id="name"
               placeholder="e.g. Narra Residence"
               value={dormitoryName}
               className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10" type={undefined}
               onChange={(e) => setDormitoryName(e.target.value)}            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label
                htmlFor="location"
                className="text-[13px] font-medium text-neutral-700 flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                Location
              </Label>
              <Input
                 id="location"
                 placeholder="e.g. North Campus"
                 value={dormitoryLocation}
                 className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10" type={undefined}
                 onChange={(e) => setDormitoryLocation(e.target.value)}              />
            </div>
          </div>
              {advisers.length > 0 && (
          <div className="grid gap-1.5">
            <Label
              htmlFor="adviser"
              className="text-[13px] font-medium text-neutral-700 flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5 text-neutral-400" />
              Adviser
            </Label>
            <Select value={dormitoryAdviser} onValueChange={(value) => setDormitoryAdviser(value)}>
              <SelectTrigger id="adviser" className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10">
                <SelectValue placeholder="Select an adviser" />
              </SelectTrigger>
              <SelectContent className={undefined} >
                {advisers
                  .filter(adviser => 
                    (adviser.id && adviser.id.trim() !== "") && 
                    (!adviser.dormitoryId || adviser.id === dormitory?.adviser)
                  )
                  .map((adviser) => (
                    <SelectItem key={adviser.id} value={adviser.id} className={undefined}>
                      {adviser.firstName + " " + adviser.lastName}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
              )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="ghost" onClick={onClose} className="hover:bg-neutral-100 text-neutral-600 font-medium" size={undefined}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium" variant={undefined} size={undefined}>
            {type === "add" ? "Register Dormitory" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}