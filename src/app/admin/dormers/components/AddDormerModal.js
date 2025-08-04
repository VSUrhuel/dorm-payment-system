"use client";

import { useState } from "react"; // 1. Import useState
import { Button } from "@/components/ui/button";
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

/**
 * @param {{
 * isOpen: boolean;
 * onClose: () => void;
 * onSave: (dormerData: object) => void; // Corrected JSDoc
 * }} props
 */
export default function AddDormerModal({ isOpen, onClose, onSave }) {
  // 2. Create state for each form field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // 3. Create a handler to gather data and call the onSave prop
  const handleSave = () => {
    if (!firstName || !lastName || !email || !phone || !role || !roomNumber) {
      alert("All fields are required.");
      return;
    }
    const dormerData = {
      firstName,
      lastName,
      email,
      phone,
      role,
      roomNumber,
    };
    onSave(dormerData); // Pass the collected data up to the parent
    onClose(); // Close the modal after saving
  };

  const handleClose = () => {
    // Reset form fields when closing the modal
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
        <DialogHeader>
          <DialogTitle>Add New Dormer</DialogTitle>
          <DialogDescription>
            Fill in the details to register a new dormitory resident
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              {/* 4. Connect input to state */}
              <Input
                id="firstName"
                className="mt-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                className="mt-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                className="mt-1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="role">Role</Label>
            {/* 4. Connect Select to state */}
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="roomNumber">Room Number</Label>
            {/* 4. Connect Select to state */}
            <Select value={roomNumber} onValueChange={setRoomNumber}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with actual room numbers */}
                <SelectItem value="1">Room 1</SelectItem>
                <SelectItem value="2">Room 2</SelectItem>
                <SelectItem value="3">Room 3</SelectItem>
                <SelectItem value="4A">Room 4A</SelectItem>
                <SelectItem value="4B">Room 4B</SelectItem>
                <SelectItem value="5">Room 5</SelectItem>
                <SelectItem value="6">Room 6</SelectItem>
                <SelectItem value="7">Room 7</SelectItem>
                <SelectItem value="8">Room 8</SelectItem>
                <SelectItem value="9">Room 9</SelectItem>
                <SelectItem value="SA Room">SA Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave} // 5. Use the new handler
          >
            Save Dormer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
