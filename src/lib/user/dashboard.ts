import {
  collection,
  addDoc,
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  Transaction,
  getDocs,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { firestore as db, auth } from "@/lib/firebase";
import { Bill, DormerData } from "../../app/admin/dormers/types";
import { totalExpenses } from "../admin/expense";
import { totalBills } from "../admin/bill";
import { totalPayments } from "../admin/payment";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";

export const dashboardData = async () => {
  const {dormitoryId, loading} = useCurrentDormitoryId();
  const expenses = await totalExpenses(dormitoryId);
  const bills = await totalBills(dormitoryId);
  const payments = await totalPayments(dormitoryId);

  return {
    totalExpenses: expenses,
    totalBills: bills,
    totalPayments: payments,
    totalDue: bills - payments,
    remainingBalance: payments - expenses,
  };
};

export const recentBills = async (userId: string, limit: number = 5) => {
  const billsRef = collection(db, "bills");
  const billsSnapshot = await getDocs(billsRef);
  const bills: Bill[] = [];

  billsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.dormerId === userId) {
      bills.push({ id: doc.id, ...data } as Bill);
    }
  });

  bills.sort((a, b) => {
    const aPeriod = a?.billingPeriod ?? "";
    const bPeriod = b?.billingPeriod ?? "";
    if (aPeriod < bPeriod) return 1;
    if (aPeriod > bPeriod) return -1;
    return 0;
  });
  return bills;
};
