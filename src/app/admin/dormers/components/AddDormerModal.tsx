"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DormerData } from "../types";

// --- Type Definitions ---
interface AddDormerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dormerData: DormerData) => void;
}

// --- Component ---
export default function AddDormerModal({
  isOpen,
  onClose,
  onSave,
}: AddDormerModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const handleSave = () => {
    if (!firstName || !lastName || !email || !phone || !role || !roomNumber) {
      toast.info("All fields are required.");
      return;
    }
    const dormerData: DormerData = {
      firstName,
      lastName,
      email,
      phone,
      role,
      roomNumber,
    };
    onSave(dormerData);
    handleClose();
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRole("");
    setRoomNumber("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add New Dormer</DialogTitle>
          <DialogDescription className={undefined}>
            Fill in the details to register a new dormitory resident
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className={undefined}>
                First Name
              </Label>
              <Input
                id="firstName"
                className="mt-1"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
                type={undefined}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className={undefined}>
                Last Name
              </Label>
              <Input
                id="lastName"
                className="mt-1"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
                type={undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className={undefined}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="phone" className={undefined}>
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                className="mt-1"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
              />
            </div>
          </div>

          <Separator className={undefined} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="role" className={undefined}>
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="Admin" className={undefined}>
                  Admin
                </SelectItem>
                <SelectItem value="User" className={undefined}>
                  User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="roomNumber" className={undefined}>
              Room Number
            </Label>
            <Select value={roomNumber} onValueChange={setRoomNumber}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="1" className={undefined}>
                  Room 1
                </SelectItem>
                <SelectItem value="2" className={undefined}>
                  Room 2
                </SelectItem>
                <SelectItem value="3" className={undefined}>
                  Room 3
                </SelectItem>
                <SelectItem value="4A" className={undefined}>
                  Room 4A
                </SelectItem>
                <SelectItem value="4B" className={undefined}>
                  Room 4B
                </SelectItem>
                <SelectItem value="5" className={undefined}>
                  Room 5
                </SelectItem>
                <SelectItem value="6" className={undefined}>
                  Room 6
                </SelectItem>
                <SelectItem value="7" className={undefined}>
                  Room 7
                </SelectItem>
                <SelectItem value="8" className={undefined}>
                  Room 8
                </SelectItem>
                <SelectItem value="9" className={undefined}>
                  Room 9
                </SelectItem>
                <SelectItem value="SA Room" className={undefined}>
                  SA Room
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className={undefined}>
          <Button
            variant="outline"
            onClick={handleClose}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave}
            variant={undefined}
            size={undefined}
          >
            Save Dormer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
