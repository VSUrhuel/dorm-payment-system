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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Home } from "lucide-react"
import { Dormer, ModalType, AdviserData } from "@/app/admin/dormers/types";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AddEditAdviserProps {
    isOpen: boolean;
    onClose: () => void;
    adviser: Dormer | null;
    type: ModalType;
    onAdd: (adviser: AdviserData) => void;
    onUpdate: (adviser: AdviserData) => void;
}

export default function AddEditAdviser({ isOpen, onClose, adviser, type, onAdd, onUpdate }: AddEditAdviserProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [roomNumber, setRoomNumber] = useState("")

  useEffect(() => {
    if (isOpen) {
      setFirstName(adviser?.firstName || "");
      setLastName(adviser?.lastName || "");
      setEmail(adviser?.email || "");
      setPhone(adviser?.phone || "");
      setRoomNumber(adviser?.roomNumber || "");
    }
  }, [adviser, isOpen]);
    
  const handleSave = () => {
    if(!firstName || !lastName || !email || !phone) {
      toast.error("Please fill in all fields!")
      return
    }

    const adviserData: AdviserData = {
      id: adviser?.id || "",
      firstName,
      lastName,
      email,
      phone,
      role: "Adviser"
    }
    
    if(type === "add") {  
      onAdd(adviserData)
    } else {
      onUpdate(adviserData)
    }
    onClose()
  }

  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-neutral-200">
        <DialogHeader className={undefined}>
          <DialogTitle className="text-xl font-semibold text-neutral-900 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center">
              <User className="h-5 w-5 text-neutral-700" />
            </div>
            {type === "add" ? "Add New Adviser" : "Edit Adviser"}
          </DialogTitle>
          <DialogDescription className="text-[15px] text-neutral-500">
            {type === "add"
              ? "Register a new dormitory adviser to the system."
              : "Update the contact information for this adviser."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label className="text-[13px] font-medium text-neutral-700">First Name</Label>
              <Input
                 placeholder="John"
                 value={firstName}
                 onChange={(e) => setFirstName(e.target.value)}
                 className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10"
                 type={undefined}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px] font-medium text-neutral-700">Last Name</Label>
              <Input
                 placeholder="Doe"
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
                 className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10"
                 type={undefined}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[13px] font-medium text-neutral-700 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-neutral-400" />
              Email Address
            </Label>
            <Input
               type="email"
               placeholder="john.doe@vsu.edu.ph"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label className="text-[13px] font-medium text-neutral-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-neutral-400" />
                Phone Number
              </Label>
              <Input
                 placeholder="0917XXXXXXX"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="border-neutral-200 focus:ring-neutral-900 focus:border-neutral-900 h-10"
                 type={undefined}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="ghost" onClick={onClose} className="hover:bg-neutral-100 text-neutral-600 font-medium" size={undefined}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium" variant={undefined} size={undefined}>
            {type === "add" ? "Add Adviser" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
