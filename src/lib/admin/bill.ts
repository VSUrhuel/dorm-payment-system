import {
  collection,
  addDoc,
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  Transaction,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { Bill } from "../../app/admin/dormers/types";
import { User } from "firebase/auth";
import { getUserPaymentWithBilll } from "./payment";

export const createBill = async (billData: Omit<Bill, "id">, user: User, dormitoryId: string) => {
  const docRef = await addDoc(collection(db, "bills"), {
    ...billData,
    dormitoryId,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateBill = async (billData: Bill, user: User) => {
  const { id, ...dataToSave } = billData;
  if (!id) throw new Error("Bill ID is required for update.");

  const billRef = doc(db, "bills", id);
  await setDoc(billRef, {
    ...dataToSave,
    updatedBy: user.uid,
    updatedAt: serverTimestamp(),
  });
  return id;
};
export const getBill = async (billId: string) => {
  const billRef = doc(db, "bills", billId);
  const billSnap = await getDoc(billRef);
  if (!billSnap.exists()) {
    throw new Error("Bill document does not exist!");
  }
  // check if bill is deleted
  if (billSnap.data()?.isDeleted) {
    throw new Error("Bill document is deleted!");
  }
  return billSnap.data() as Bill;
};

export const totalBills = async (dormitoryId: string) => {
  const billsSnapshot = await getDocs(collection(db, "bills"));
  let total = 0;
  billsSnapshot.forEach((doc) => {
    const data = doc.data();
    // check if bill is deleted
    if (data.isDeleted) return;
    if (data.dormitoryId !== dormitoryId) return;
    total += Number(data.totalAmountDue) || 0;
  });
  return total;
};

export const getBills = async (userId: string, dormitoryId: string): Promise<any[]> => {
  try {
    const billsQuery = query(
      collection(db, "bills"),
      where("dormerId", "==", userId),
      where("dormitoryId", "==", dormitoryId),
    );

    const billsSnapshot = await getDocs(billsQuery);
    const billsPromises = billsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const paymentList = await getUserPaymentWithBilll(userId, doc.id);

      return {
        id: doc.id,
        ...data,
        ...paymentList,
      } as any;
    });

    // Wait for all promises to resolve, then sort the resolved bill objects by billingPeriod descending
    const bills = await Promise.all(billsPromises);
    bills.sort((a, b) => {
      const aPeriod = a?.billingPeriod ?? "";
      const bPeriod = b?.billingPeriod ?? "";
      if (aPeriod < bPeriod) return 1;
      if (aPeriod > bPeriod) return -1;
      return 0;
    });

    console.log("Fetched and sorted bills:", bills);

    return bills;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw new Error("Failed to load bills");
  }
};
