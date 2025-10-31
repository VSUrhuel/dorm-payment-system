import {
  collection,
  doc,
  runTransaction,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { User } from "firebase/auth";

export const recordPayment = async (paymentData: any, user: User) => {
  await runTransaction(db, async (transaction) => {
    const billRef = doc(db, "bills", paymentData.billId);
    const billDoc = await transaction.get(billRef);
    if (!billDoc.exists()) {
      throw new Error("Bill document does not exist!");
    }

    const currentBillData = billDoc.data();
    const currentAmountPaid = currentBillData.amountPaid || 0;
    const totalAmountDue = currentBillData.totalAmountDue;

    const newPaymentAmount = paymentData.amount;
    const newAmountPaid = Math.min(
      totalAmountDue,
      currentAmountPaid + newPaymentAmount
    );

    let newStatus: "Paid" | "Partially Paid" = "Partially Paid";
    if (newAmountPaid >= totalAmountDue) {
      newStatus = "Paid";
    }

    await addDoc(collection(db, "payments"), {
      ...paymentData,
      recordedBy: user.uid,
      createdAt: serverTimestamp(),
    });

    transaction.update(billRef, {
      amountPaid: newAmountPaid,
      status: newStatus,
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    });
  });
};
