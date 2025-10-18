import { Dormer } from "../dormers/types";

export interface Event {
  id: string;
  name: string;
  description: string;
  amountDue: number;
  dueDate: string;
  status: "Active" | "Inactive";
  createdAt: any;
}

export interface EventPayment {
  id: string;
  eventId: string;
  dormerId: string;
  amount: number;
  status: "Paid" | "Partial" | "Unpaid";
  paymentMethod: string;
  createdAt: any;
  recordedBy: {
    name: string;
    email: string;
  };
}

export interface EventDormerData extends Dormer {
  paymentStatus: "Paid" | "Partial" | "Unpaid";
  amountPaid: number;
  paymentDate: any | null;
  paymentMethod: string | null;
  recordedBy: { name: string; email: string } | null;
}
