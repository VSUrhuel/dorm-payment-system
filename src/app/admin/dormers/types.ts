import { Key } from "react";

export interface Dormer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roomNumber: string;
  createdAt: any;
  dormitoryId: string;
  isDeleted?: boolean;
  bills: Bill[];
}

export interface Bill {
  dormer: any;
  billDate: any;
  remainingBalance: number;
  id: string;
  dormerId: string;
  billingPeriod: string;
  status: "Paid" | "Unpaid" | "Partially Paid" | "Overdue";
  totalAmountDue: number;
  amountPaid: number;
  description: string;
  updatedAt: any;
  isDeleted?: boolean;
}

export interface Payable {
  id: string;
  name: string;
  amount: number;
  description: string;
}

export type ModalType =
  | "add"
  | "bills"
  | "payment"
  | "generateBill"
  | "deleteDormer"
  | "edit"
  | "delete"
  | null;

export interface DormerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roomNumber: string;
  dormerId?: string;
}
