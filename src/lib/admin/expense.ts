import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";

export const addExpense = async (expenseData: any, recordedBy: string) => {
  const docRef = await addDoc(collection(db, "expenses"), {
    ...expenseData,
    recordedBy,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateExpense = async (expenseData: any, updatedBy: string) => {
  const expenseRef = doc(db, "expenses", expenseData.id);
  await updateDoc(expenseRef, {
    ...expenseData,
    updatedBy,
    updatedAt: serverTimestamp(),
  });
};
