import {
  collection,
  addDoc,
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  Transaction,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { firestore as db, auth } from "@/lib/firebase";
import { Bill, DormerData } from "../../app/admin/dormers/types";

export const createAdminDormer = async (
  dormerData: DormerData,
  currentAdmin: User,
  adminEmail: string,
  adminPassword: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    dormerData.email,
    "defaultAdminPassword123"
  );
  const newAdminUid = userCredential.user.uid;

  if (adminEmail && adminPassword) {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  }

  await setDoc(doc(db, "dormers", newAdminUid), {
    ...dormerData,
    createdAt: serverTimestamp(),
    createdBy: currentAdmin.uid,
  });

  return newAdminUid;
};

export const createUserDormer = async (
  dormerData: DormerData,
  currentAdmin: User
) => {
  const docRef = await addDoc(collection(db, "dormers"), {
    ...dormerData,
    createdAt: serverTimestamp(),
    createdBy: currentAdmin.uid,
  });
  return docRef.id;
};

export const recordPaymentTransaction = async (
  paymentData: any,
  user: User
) => {
  const billRef = doc(db, "bills", paymentData.billId);

  return runTransaction(db, async (transaction: Transaction) => {
    const billDoc = await transaction.get(billRef);
    if (!billDoc.exists()) {
      throw new Error("Bill document does not exist!");
    }

    const currentBillData = billDoc.data();
    const totalAmountDue = currentBillData.totalAmountDue;
    const amountAlreadyPaid = currentBillData.amountPaid || 0;
    const newTotalPaid = amountAlreadyPaid + paymentData.amount;
    const finalAmountPaidForBill = Math.min(newTotalPaid, totalAmountDue);

    let newStatus: Bill["status"] = "Unpaid";
    if (finalAmountPaidForBill >= totalAmountDue) {
      newStatus = "Paid";
    } else if (finalAmountPaidForBill > 0) {
      newStatus = "Partially Paid";
    }

    await addDoc(collection(db, "payments"), {
      ...paymentData,
      recordedBy: user.uid,
      createdAt: serverTimestamp(),
    });

    transaction.update(billRef, {
      amountPaid: finalAmountPaidForBill,
      status: newStatus,
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    });

    return { newStatus, finalAmountPaidForBill };
  });
};

export const softDeleteDormer = async (dormerId: string) => {
  if (!dormerId) throw new Error("Dormer ID is required for deletion.");

  const dormerRef = doc(db, "dormers", dormerId);
  await updateDoc(dormerRef, {
    isDeleted: true,
    deletedAt: serverTimestamp(),
  });
};
