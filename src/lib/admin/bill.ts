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
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { Bill } from "../../app/admin/dormers/types";
import { User } from "firebase/auth";

export const createBill = async (billData: Omit<Bill, "id">, user: User) => {
  const docRef = await addDoc(collection(db, "bills"), {
    ...billData,
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
  return billSnap.data() as Bill;
};
