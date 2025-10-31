import { useState } from "react";
import { firestore as db, auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Dormer, Bill, DormerData } from "../types";
import { welcomeAdminTemplate } from "../email-templates/welcomeAdmin";
import { welcomeUserTemplate } from "../email-templates/welcomeUser";
import { newBillTemplate } from "../email-templates/newBill";
import {
  createAdminDormer,
  createUserDormer,
  recordPaymentTransaction,
  softDeleteDormer,
} from "@/lib/admin/dormer";
import { User } from "firebase/auth";
import { createBill, getBill, updateBill } from "@/lib/admin/bill";
import { paymentConfirmationEmailTemplate } from "../../payments/utils/email";
import { generateRandomPassword } from "../utils/generateRandomPass";

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
    const temporaryPassword = generateRandomPassword();
    try {
      const existingDormer = dormers.find((d) => d.email === dormerData.email);
      if (existingDormer) {
        toast.error("A dormer with this email already exists.");
        return;
      }

      const adminPassword = prompt(
        "To add security, please enter your password:"
      );

      if (!adminPassword) {
        toast.info("Admin creation canceled.");
        return;
      }

      if (dormerData.role === "Admin") {
        await createAdminDormer(
          dormerData,
          currentAdmin,
          adminEmail,
          adminPassword,
          temporaryPassword
        );

        toast.success("Admin dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: welcomeAdminTemplate(
            dormerData.firstName,
            dormerData.email,
            temporaryPassword
          ),
        });
      } else {
        await createUserDormer(
          dormerData,
          user,
          adminEmail,
          adminPassword,
          temporaryPassword
        );

        toast.success("Dormer added successfully!");
        await sendEmail({
          to: dormerData.email,
          subject: "Welcome to Mabolo Payment System",
          html: welcomeUserTemplate(
            dormerData.firstName,
            dormerData.email,
            temporaryPassword
          ),
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

    try {
      await recordPaymentTransaction(paymentData, user);

      toast.success("Payment recorded successfully!");

      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      if (dormerInfo) {
        const billData = await getBill(paymentData.billId);
        await sendEmail({
          to: dormerInfo.email,
          subject: `Payment Confirmation - ${paymentData.billId}`,
          html: paymentConfirmationEmailTemplate(
            dormerInfo.firstName,
            paymentData,
            billData
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
        await updateBill(billData, user);
        toast.success("Bill overwritten successfully!");
      } else {
        await createBill(billData, user);
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
      await softDeleteDormer(dormerId);
      toast.success("Dormer deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete dormer.");
    }
  };

  // ONLY CREATED FOR A UTILITY TASK
  // const updatePaymentIncludeDormerDetails = async () => {
  //   const paymentsRef = collection(db, "payments");
  //   const snapshot = await getDocs(paymentsRef);
  //   const batch = writeBatch(db);
  //   snapshot.forEach((docSnap) => {
  //     const paymentData = docSnap.data();
  //     const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
  //     if (dormerInfo) {
  //       const paymentRef = doc(db, "payments", docSnap.id);
  //       batch.update(paymentRef, {
  //         dormerDetails: {
  //           firstName: dormerInfo.firstName,
  //           lastName: dormerInfo.lastName,
  //           roomNumber: dormerInfo.roomNumber,
  //           email: dormerInfo.email,
  //         },
  //       });
  //     }
  //   });
  //   await batch.commit();
  //   toast.success("Payment documents updated with dormer details.");
  // };

  return {
    saveDormer,
    handleSavePayment,
    saveBill,
    deleteDormer,
    isSubmitting,
  };
}
