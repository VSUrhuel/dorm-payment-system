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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className={undefined}>
          <DialogTitle className="text-2xl font-bold text-[#12372A] flex items-center gap-2">
            <User className="h-6 w-6" />
            {type === "add" ? "Add New Adviser" : "Edit Adviser Details"}
          </DialogTitle>
          <DialogDescription className={undefined}>
            {type === "add"
              ? "Register a new dormitory adviser to the system."
              : "Update the contact information for this adviser."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#12372A]">First Name</Label>
              <Input
                 placeholder="John"
                 value={firstName}
                 onChange={(e) => setFirstName(e.target.value)}
                 className="border-gray-200"
                 type={undefined}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#12372A]">Last Name</Label>
              <Input
                 placeholder="Doe"
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
                 className="border-gray-200"
                 type={undefined}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#12372A] flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email Address
            </Label>
            <Input
               type="email"
               placeholder="john.doe@vsu.edu.ph"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#12372A] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Phone Number
              </Label>
              <Input
                 placeholder="0917XXXXXXX"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="border-gray-200"
                 type={undefined}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="hover:bg-gray-100" size={undefined}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#12372A] hover:bg-[#12372A]/90 text-white" variant={undefined} size={undefined}>
            {type === "add" ? "Register Adviser" : "Update Adviser"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
