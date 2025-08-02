"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileUp,
  FileDown,
  Plus,
  Eye,
  CreditCard,
  FileText,
  DollarSign,
  Search,
  Filter,
  ChevronDown,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock Data Aligned with Full ERD ---
const dormersData = [
  {
    userId: "user_001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dormerDetails: {
      dormerId: "dormer_001",
      roomNumber: "101",
      status: "Active",
      moveInDate: "2025-01-15",
    },
    bills: [
      {
        billId: "bill_01",
        billingPeriod: "2025-08",
        totalAmountDue: 275.0,
        amountPaid: 275.0,
        status: "Paid",
        dueDate: "2025-08-31",
        paymentDate: "2025-08-15",
      },
      {
        billId: "bill_02",
        billingPeriod: "2025-09",
        totalAmountDue: 275.0,
        amountPaid: 0.0,
        status: "Unpaid",
        dueDate: "2025-09-30",
      },
    ],
  },
  {
    userId: "user_002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    dormerDetails: {
      dormerId: "dormer_002",
      roomNumber: "205",
      status: "Active",
      moveInDate: "2025-02-20",
    },
    bills: [
      {
        billId: "bill_03",
        billingPeriod: "2025-08",
        totalAmountDue: 325.0,
        amountPaid: 200.0,
        status: "Partially Paid",
        dueDate: "2025-08-31",
      },
      {
        billId: "bill_04",
        billingPeriod: "2025-09",
        totalAmountDue: 325.0,
        amountPaid: 0.0,
        status: "Overdue",
        dueDate: "2025-09-30",
      },
    ],
  },
];

export default function DormersPage() {
  const [modal, setModal] = useState(null);
  const [selectedDormer, setSelectedDormer] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const openModal = (modalType, dormer = null, bill = null) => {
    setModal(modalType);
    setSelectedDormer(dormer);
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDormer(null);
    setSelectedBill(null);
  };

  const filteredDormers = dormersData.filter((dormer) => {
    const matchesSearch =
      `${dormer.firstName} ${dormer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dormer.dormerDetails.roomNumber.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || dormer.dormerDetails.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dormer Management
          </h1>
          <p className="text-sm text-gray-600">
            Generate bills and track payments for all residents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => openModal("add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dormer
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search dormers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end">
          <Badge variant="outline" className="bg-gray-50">
            {filteredDormers.length}{" "}
            {filteredDormers.length === 1 ? "dormer" : "dormers"}
          </Badge>
        </div>
      </div>

      {/* Dormers Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Dormer Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Move-In Date
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDormers.map((dormer) => (
                <TableRow key={dormer.userId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-800">
                          {dormer.firstName[0]}
                          {dormer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>
                          {dormer.firstName} {dormer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dormer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{dormer.dormerDetails.roomNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        dormer.dormerDetails.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        dormer.dormerDetails.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {dormer.dormerDetails.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(
                      dormer.dormerDetails.moveInDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal("generateBill", dormer)}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Bill
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openModal("bills", dormer)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODALS --- */}
      <AddDormerModal isOpen={modal === "add"} onClose={closeModal} />
      <BillsModal
        isOpen={modal === "bills"}
        onClose={closeModal}
        dormer={selectedDormer}
        onRecordPayment={(bill) => openModal("payment", selectedDormer, bill)}
      />
      <PaymentModal
        isOpen={modal === "payment"}
        onClose={closeModal}
        dormer={selectedDormer}
        bill={selectedBill}
      />
      <GenerateBillModal
        isOpen={modal === "generateBill"}
        onClose={closeModal}
        dormer={selectedDormer}
      />
    </div>
  );
}

// --- Bills Modal ---
function BillsModal({ isOpen, onClose, dormer, onRecordPayment }) {
  if (!dormer) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return {
          className: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
        };
      case "Unpaid":
        return {
          className: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "Partially Paid":
        return {
          className: "bg-blue-100 text-blue-800",
          icon: <DollarSign className="h-4 w-4 mr-1" />,
        };
      case "Overdue":
        return {
          className: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          icon: null,
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>
                {dormer.firstName} {dormer.lastName}
              </DialogTitle>
              <DialogDescription>
                Room {dormer.dormerDetails.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="bills" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent
            value="bills"
            className="py-4 max-h-[60vh] overflow-y-auto"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dormer.bills.map((bill) => {
                  const status = getStatusBadge(bill.status);
                  return (
                    <TableRow key={bill.billId}>
                      <TableCell>{bill.billingPeriod}</TableCell>
                      <TableCell>${bill.totalAmountDue.toFixed(2)}</TableCell>
                      <TableCell>${bill.amountPaid.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={status.className}>
                          {status.icon}
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(bill.status === "Unpaid" ||
                          bill.status === "Partially Paid" ||
                          bill.status === "Overdue") && (
                          <Button
                            size="sm"
                            onClick={() => onRecordPayment(bill)}
                            className="h-8"
                          >
                            <CreditCard className="h-4 w-4 mr-1" /> Pay
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="details" className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p>{dormer.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p>{dormer.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Dormitory Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Room Number</Label>
                    <p>{dormer.dormerDetails.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">
                      Move-In Date
                    </Label>
                    <p>
                      {new Date(
                        dormer.dormerDetails.moveInDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge
                      className={
                        dormer.dormerDetails.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {dormer.dormerDetails.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// --- Payment Modal ---
function PaymentModal({ isOpen, onClose, dormer, bill }) {
  if (!dormer || !bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                {dormer.firstName} {dormer.lastName} • Room{" "}
                {dormer.dormerDetails.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">
                Bill Summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    Billing Period
                  </Label>
                  <p>{bill.billingPeriod}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Due Date</Label>
                  <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Amount Due</Label>
                  <p className="font-medium">
                    ${bill.totalAmountDue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Amount Paid</Label>
                  <p className="font-medium">${bill.amountPaid.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                placeholder={bill.totalAmountDue.toFixed(2)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input id="paymentDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Mobile Payment">
                      Mobile Payment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentNotes">Notes</Label>
              <Textarea
                id="paymentNotes"
                placeholder="e.g., Partial payment for September rent"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Generate Bill Modal ---
function GenerateBillModal({ isOpen, onClose, dormer }) {
  if (!dormer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-800">
                {dormer.firstName[0]}
                {dormer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Generate New Bill</DialogTitle>
              <DialogDescription>
                {dormer.firstName} {dormer.lastName} • Room{" "}
                {dormer.dormerDetails.roomNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingPeriod">Billing Period</Label>
              <Input
                id="billingPeriod"
                placeholder="YYYY-MM (e.g., 2025-09)"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Monthly rent for September"
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Generate Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Add Dormer Modal ---
function AddDormerModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
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
              <Input id="firstName" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" className="mt-1" />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="moveInDate">Move-In Date</Label>
              <Input id="moveInDate" type="date" className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Save Dormer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
