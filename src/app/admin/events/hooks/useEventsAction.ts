"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { toast } from "sonner";
import { Event } from "../types";
import { Dormer } from "../../dormers/types";
import { addEvent, updateEvent } from "@/lib/admin/event";
import { newEventEmailTemplate } from "../utils/email";

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
        await updateEvent(dataToSave, id);
        toast.success("Event updated successfully!");
      } else {
        await addEvent(dataToSave, user.uid);
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
