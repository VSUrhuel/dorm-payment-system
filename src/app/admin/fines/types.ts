import { Timestamp } from "firebase/firestore";

export interface Fine {
    id?: string;
    name: string;
    amount: number;
    description: string;
    isDeleted?: boolean;
}

export interface FineSummary {
    totalFines: number;
    collectedFines: number;
    collectibleFines: number;
}

export interface PaymentFines {
    id?: string;
    billedFineId: string;
    totalAmountDue: number;
    amountPaid: number;
    remainingBalance: number;
    paymentDate: Timestamp;
    dormerId: string;
    dormitoryId: string;
    createdAt: Timestamp;
    status: "Paid" | "Unpaid" | "Partially Paid";
    isDeleted?: boolean;
}

export interface BillFines {
    id?: string;
    totalAmountDue: number;
    dormerId: string;
    dormitoryId: string;
    isDeleted?: boolean;
}