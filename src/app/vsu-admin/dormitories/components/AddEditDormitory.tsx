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
    if(dormitoryName === "" || dormitoryLocation === "" || dormitoryAdviser === "") {
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
      toast.success("Dormitory added successfully!")
    } else {
      onUpdate({
        id: dormitory.id,
        name: dormitoryName,
        location: dormitoryLocation,
        adviser: dormitoryAdviser
      })
      toast.success("Dormitory updated successfully!")
    }
    onClose()
  }
  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className={undefined}>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            {type === "add" ? (
              <>
                <Building2 className="h-6 w-6 text-secondary" />
                Add New Dormitory
              </>
            ) : (
              <>
                <Building2 className="h-6 w-6 text-secondary" />
                Edit Building Details
              </>
            )}
          </DialogTitle>
          <DialogDescription className={undefined}>
            {type === "add"
              ? "Complete the form below to add a new building to the university dormitory registry."
              : "Update the building information and status for the dormitory registry."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5"
            >
              <Building2 className="h-3.5 w-3.5" />
              Building Name
            </Label>
            <Input
               id="name"
               placeholder="e.g. Narra Residence"
               value={dormitoryName}
               className="border-gray-200 focus:ring-secondary focus:border-secondary transition-all" type={undefined}
               onChange={(e) => setDormitoryName(e.target.value)}            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="location"
                className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5"
              >
                <MapPin className="h-3.5 w-3.5" />
                Location
              </Label>
              <Input
                 id="location"
                 placeholder="e.g. North Campus"
                 value={dormitoryLocation}
                 className="border-gray-200 focus:ring-secondary focus:border-secondary" type={undefined}
                 onChange={(e) => setDormitoryLocation(e.target.value)}              />
            </div>
          </div>
              {advisers.length > 0 && (
          <div className="grid gap-2">
            <Label
              htmlFor="adviser"
              className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5" />
              Adviser
            </Label>
            <Select value={dormitoryAdviser} onValueChange={(value) => setDormitoryAdviser(value)}>
              <SelectTrigger id="adviser" className="border-gray-200 focus:ring-secondary focus:border-secondary">
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

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="hover:bg-gray-100" size={undefined}>
            Discard Changes
          </Button>
          <Button onClick={handleSave} className="hover:bg-blue-500" variant={undefined} size={undefined}>
            {type === "add" ? "Register Dormitory" : "Update Registry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}