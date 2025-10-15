import { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { firestore as db, auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Dormer, Bill, DormerData } from "../types";
import { welcomeAdminTemplate } from "../email-templates/welcomeAdmin";
import { welcomeUserTemplate } from "../email-templates/welcomeUser";
import { paymentConfirmationTemplate } from "../email-templates/paymentConfirmation";
import { newBillTemplate } from "../email-templates/newBill";
import { writeBatch, getDocs } from "firebase/firestore";

export function useDormerActions(dormers: Dormer[], bills: Bill[]) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (emailData: {
    to: string;
    subject: string;
    html: string;
  }) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      await response.json();
    } catch (error) {
      toast.error("Failed to send notification email.");
    }
  };

  const saveDormer = async (dormerData: DormerData, user: User | null) => {
    if (!user) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      toast.error("Could not verify current admin session.");
      return;
    }
    const adminEmail = currentAdmin.email;

    try {
      const existingDormer = dormers.find((d) => d.email === dormerData.email);
      if (existingDormer) {
        toast.error("A dormer with this email already exists.");
        return;
      }

      if (dormerData.role === "Admin") {
        const adminPassword = prompt(
          "To keep your session active, please re-enter your password:"
        );

        if (!adminPassword) {
          toast.info("Admin creation canceled.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          dormerData.email,
          "defaultAdminPassword123"
        );
        const newAdminUid = userCredential.user.uid;

        if (adminEmail) {
          await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        }

        await setDoc(doc(db, "dormers", newAdminUid), {
          ...dormerData,
          createdBy: currentAdmin.uid,
          createdAt: serverTimestamp(),
        });

        toast.success("Admin dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: welcomeAdminTemplate(dormerData.firstName, dormerData.email),
        });
      } else {
        await addDoc(collection(db, "dormers"), {
          ...dormerData,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });

        toast.success("Dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: welcomeUserTemplate(dormerData.firstName),
        });
      }
    } catch (error: any) {
      console.error("Error adding dormer: ", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Re-authentication failed. Please log in again.");
      } else {
        toast.error(`Failed to add dormer: ${error.message}`);
      }
    }
  };

  const handleSavePayment = async (paymentData: any, user: User | null) => {
    if (!user || !paymentData.billId) {
      toast.error("Authentication or data error.");
      return;
    }

    const billRef = doc(db, "bills", paymentData.billId);

    try {
      await runTransaction(db, async (transaction) => {
        const billDoc = await transaction.get(billRef);
        if (!billDoc.exists()) {
          throw "Bill document does not exist!";
        }
        const currentBillData = billDoc.data();
        const totalAmountDue = currentBillData.totalAmountDue;
        const amountAlreadyPaid = currentBillData.amountPaid || 0;
        const newTotalPaid = amountAlreadyPaid + paymentData.amount;
        const finalAmountPaidForBill = Math.min(newTotalPaid, totalAmountDue);
        let newStatus = "Unpaid";

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
      });

      toast.success("Payment recorded successfully!");

      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      if (dormerInfo) {
        await sendEmail({
          to: dormerInfo.email,
          subject: `Payment Confirmation - ${paymentData.billId}`,
          html: paymentConfirmationTemplate(
            dormerInfo.firstName,
            paymentData.amount,
            paymentData.billId
          ),
        });
      }
    } catch (error) {
      toast.error("Failed to save payment.");
    }
  };

  const saveBill = async (billData: Bill, user: User | null) => {
    // await updatePaymentIncludeDormerDetails();
    if (!user || !billData) {
      toast.error("Authentication error or missing bill data.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { id, ...dataToSave } = billData;

      if (id) {
        const billRef = doc(db, "bills", id);
        await setDoc(billRef, {
          ...dataToSave,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success("Bill overwritten successfully!");
      } else {
        await addDoc(collection(db, "bills"), {
          ...dataToSave,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
        toast.success("New bill generated successfully!");
      }

      const dormerInfo = dormers.find((d) => d.id === billData.dormerId);
      if (dormerInfo) {
        await sendEmail({
          to: dormerInfo.email,
          subject: `New Bill for ${billData.billingPeriod}`,
          html: newBillTemplate(
            dormerInfo.firstName,
            billData.billingPeriod,
            billData.totalAmountDue
          ),
        });
      }
    } catch (error) {
      toast.error("Error saving bill!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDormer = async (dormerId: string) => {
    if (!dormerId) {
      toast.error("Dormer ID is required for deletion.");
      return;
    }

    try {
      // soft delete implementation
      updateDoc(doc(db, "dormers", dormerId), {
        isDeleted: true,
        deletedAt: serverTimestamp(),
      });
      // hard delete implementation
      // await deleteDoc(doc(db, "dormers", dormerId));
      toast.success("Dormer deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete dormer.");
    }
  };
  const updatePaymentIncludeDormerDetails = async () => {
    const paymentsRef = collection(db, "payments");
    const snapshot = await getDocs(paymentsRef);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      const paymentData = docSnap.data();
      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      if (dormerInfo) {
        const paymentRef = doc(db, "payments", docSnap.id);
        batch.update(paymentRef, {
          dormerDetails: {
            firstName: dormerInfo.firstName,
            lastName: dormerInfo.lastName,
            roomNumber: dormerInfo.roomNumber,
            email: dormerInfo.email,
          },
        });
      }
    });
    await batch.commit();
    toast.success("Payment documents updated with dormer details.");
  };

  return {
    saveDormer,
    handleSavePayment,
    saveBill,
    deleteDormer,
    isSubmitting,
  };
}
