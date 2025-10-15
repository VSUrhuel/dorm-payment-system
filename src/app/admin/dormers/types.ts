export interface Dormer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roomNumber: string;
  createdAt: any;
  bills: Bill[];
}

export interface Bill {
  id: string;
  dormerId: string;
  billingPeriod: string;
  status: "Paid" | "Unpaid" | "Partially Paid" | "Overdue";
  totalAmountDue: number;
  amountPaid: number;
  description: string;
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
  | null;

export interface DormerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roomNumber: string;
}
