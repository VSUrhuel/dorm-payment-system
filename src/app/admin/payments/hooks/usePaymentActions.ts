"use client";

import {
  collection,
  doc,
  runTransaction,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import { toast } from "sonner";
import { User } from "firebase/auth";
import { Dormer } from "../../dormers/types";

export function usePaymentActions(dormers: Dormer[]) {
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
      console.error("Error sending email:", error);
      toast.error("Failed to send payment confirmation email.");
    }
  };

  const handleRecordPayment = async (paymentData: any, user: User | null) => {
    if (!user || !paymentData.billId) {
      console.error(
        "Authentication or data error: User or Bill ID is missing."
      );
      return;
    }

    const billRef = doc(db, "bills", paymentData.billId);

    try {
      await runTransaction(db, async (transaction) => {
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

      toast.success("Payment recorded successfully!");

      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      if (dormerInfo?.email) {
        await sendEmail({
          to: dormerInfo.email,
          subject: `Payment Confirmation - ${paymentData.billId}`,
          html: `
            <h1>Payment Received!</h1>
            <p>Hi ${dormerInfo.firstName},</p>
            <p>We've received your payment of <strong>₱${paymentData.amount.toFixed(
              2
            )}</strong>.</p>
            <p>Thank you!</p> <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
              <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("Error saving payment in transaction: ", error);
      toast.error(`Payment recording failed!`);
    }
  };

  return { handleRecordPayment };
}
