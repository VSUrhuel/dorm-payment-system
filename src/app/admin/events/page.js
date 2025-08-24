"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, CreditCard } from "lucide-react";
import Link from "next/link";
import AddEventModal from "./components/AddEventModal";
import { useEffect, useState } from "react";
import { firestore as db, auth } from "@/lib/firebase";

import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "sonner";

export default function EventsContent() {
  const [handleOpen, setHandleOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [dormerTotal, setDormerTotal] = useState(0);
  const [eventPayments, setEventPayments] = useState([]);
  // Removed eventPaid state as we'll calculate this per event
  const [dormersData, setDormersData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventsData(events);
    });

    const dormerDataUnsubscribe = onSnapshot(
      collection(db, "dormers"),
      (snapshot) => {
        const total = snapshot.docs.length;
        setDormerTotal(total);
        setDormersData(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    const eventPaymentsUnsubscribe = onSnapshot(
      collection(db, "eventPayments"),
      (snapshot) => {
        const payments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEventPayments(payments);
        // Removed the global eventPaid calculation as it was incorrect
      }
    );

    return () => {
      unsubscribe();
      dormerDataUnsubscribe();
      eventPaymentsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Function to calculate paid count for a specific event
  const getPaidCountForEvent = (eventId) => {
    // Get all payments for this specific event
    const eventSpecificPayments = eventPayments.filter(
      (payment) => payment.eventId === eventId
    );

    // Get unique dormers who have paid in full for this event
    const paidDormers = new Set();

    eventSpecificPayments.forEach((payment) => {
      if (payment.status === "Paid") {
        paidDormers.add(payment.dormerId);
      }
    });

    return paidDormers.size;
  };

  // Function to calculate partial payments for a specific event
  const getPartialCountForEvent = (eventId) => {
    const eventSpecificPayments = eventPayments.filter(
      (payment) => payment.eventId === eventId
    );

    // Get dormers who have made partial payments
    const partialDormers = new Set();

    eventSpecificPayments.forEach((payment) => {
      if (payment.status === "Partial") {
        partialDormers.add(payment.dormerId);
      }
    });

    return partialDormers.size;
  };

  const sendEmail = async (emailData) => {
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
      toast.error("Failed to send notification email.");
    }
  };

  const recipientEmails = dormersData
    .map((dormer) => dormer.email)
    .filter(Boolean);

  const handleSaveEvent = async (eventData) => {
    if (!user || !eventData) {
      console.error("Authentication error or missing event data.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { id, ...dataToSave } = eventData;

      if (id) {
        const eventRef = doc(db, "events", id);
        await setDoc(eventRef, {
          ...dataToSave,
          updatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success("Event overwritten successfully!");
      } else {
        await addDoc(collection(db, "events"), {
          ...dataToSave,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
        toast.success("New event generated successfully!");
      }

      await sendEmail({
        to: recipientEmails.join(", "),
        subject: `${eventData.name} Event Created`,
        html: `
              <h1>New Event Created</h1>
              <p>Hi dormers,</p>
              <p>A new event was created <strong>${eventData.name}</strong>.</p>
              <p>Amount Due: <strong>₱${eventData.amountDue}</strong></p>
              <p>Pay this amount on or before <strong>${
                eventData.dueDate
              }</strong> to the Dormitory Treasurer.</p>

               <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
                <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                  <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                  <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                  <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
              </div>
            `,
      });
    } catch (error) {
      console.error("Error saving event: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-2 md:flex md:justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Payables</h1>
          <p className="text-gray-600 mt-2">
            Manage one-time payables separate from the main dorm fund
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setHandleOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <AddEventModal
        isOpen={handleOpen}
        onClose={() => setHandleOpen(false)}
        onSave={handleSaveEvent}
      />

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsData.map((event, index) => {
          // Calculate paid count for this specific event
          const paidCount = getPaidCountForEvent(event.id);
          const partialCount = getPartialCountForEvent(event.id);
          const unpaidCount = dormerTotal - paidCount - partialCount;
          const progressPercentage =
            dormerTotal > 0 ? (paidCount / dormerTotal) * 100 : 0;

          return (
            <Card key={index} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {event.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Amount Due per Dormer:
                  </span>
                  <span className="font-semibold text-green-600">
                    ₱{event.amountDue}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Collection Progress:</span>
                    <span className="font-medium">
                      {paidCount}/{dormerTotal} Paid
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round(progressPercentage)}% Complete
                  </div>

                  {/* Additional payment status information */}
                  <div className="grid grid-cols-3 gap-1 text-xs text-center mt-2">
                    <div className="text-green-600">{paidCount} Paid</div>
                    <div className="text-yellow-600">
                      {partialCount} Partial
                    </div>
                    <div className="text-red-600">{unpaidCount} Unpaid</div>
                  </div>
                </div>

                <div className="w-full">
                  <Link href={`/admin/events/${event.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
