import { Dormer } from "../dormers/types";

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  category: "Utilities" | "Maintenance" | "Security" | "Supplies" | "Other";
  receiptImageUrl?: string;
  recordedBy: string | Dormer; // Can be a UID string or a populated Dormer object
  createdAt: any;
  updatedAt?: any;
  updatedBy?: string;
}

export interface ExpenseData extends Omit<Expense, "recordedBy"> {
  recordedBy: Dormer;
}

export interface SummaryStats {
  totalExpenses: number;
  monthlyExpenses: number;
  topCategory: string;
  expensesByCategory: Record<string, number>;
}
