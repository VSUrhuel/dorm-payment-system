"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore as db } from "../../../../lib/firebase";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { Event } from "../types";
import { Dormer } from "../../dormers/types";

// This would be in a separate email template file
const newEventEmailTemplate = (
  eventName: string,
  amountDue: number,
  dueDate: string
) => `
  <h1>New Event Created</h1>
  <p>Hi dormers,</p>
  <p>A new event, <strong>${eventName}</strong>, has been created.</p>
  <p>Amount Due: <strong>₱${amountDue.toFixed(2)}</strong></p>
  <p>Please pay this amount on or before <strong>${dueDate}</strong> to the Dormitory Treasurer or Auditor.</p>
  <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
  <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
      <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;

export function useEventActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (emailData: any) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      if (!response.ok) throw new Error("Failed to send email");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send notification email.");
    }
  };

  const handleSaveEvent = async (
    eventData: Omit<Event, "id" | "createdAt">,
    user: User | null,
    dormers: Dormer[]
  ) => {
    if (!user) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { id, ...dataToSave } = eventData as any; // Using 'as any' to handle potential 'id'

      if (id) {
        await setDoc(doc(db, "events", id), {
          ...dataToSave,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success("Event updated successfully!");
      } else {
        await addDoc(collection(db, "events"), {
          ...dataToSave,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
        toast.success("New event created successfully!");
      }

      const recipientEmails = dormers.map((d) => d.email).filter(Boolean);
      if (recipientEmails.length > 0) {
        await sendEmail({
          to: recipientEmails.join(", "),
          subject: `New Event: ${eventData.name}`,
          html: newEventEmailTemplate(
            eventData.name,
            eventData.amountDue,
            eventData.dueDate
          ),
        });
      }
    } catch (error: any) {
      toast.error(`Error saving event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSaveEvent };
}
