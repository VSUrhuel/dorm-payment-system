"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "../../../../lib/firebase";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { Expense } from "../types";

export function useExpenseActions(expenses: Expense[]) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "recordedBy" | "createdAt">,
    user: User | null
  ) => {
    if (!user) {
      toast.error("You must be logged in to add an expense.");
      return;
    }
    setIsSubmitting(true);
    try {
      const expenseExists = expenses.some((e) => e.title === expenseData.title);
      if (expenseExists) {
        toast.error("An expense with this title already exists.");
        return;
      }
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        recordedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Expense added successfully!");
    } catch (error: any) {
      console.log(error.message);
      toast.error(`Failed to add expense: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExpense = async (
    expenseData: Expense,
    user: User | null
  ) => {
    if (!user) {
      toast.error("You must be logged in to update an expense.");
      return;
    }
    setIsSubmitting(true);
    try {
      const expenseRef = doc(db, "expenses", expenseData.id);
      await updateDoc(expenseRef, {
        ...expenseData,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      toast.success("Expense updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update expense: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleAddExpense,
    handleUpdateExpense,
  };
}
