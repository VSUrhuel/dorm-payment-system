"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import EventDormersTable from "../components/EventDormersTable";
import AddEventPaymentModal from "../components/AddEventPaymentModal";
import DormerFilters from "../../dormers/components/DormerFilters";

import { useEffect, useMemo, useState } from "react";
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
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { dormersData } from "../../dormers/data";

export default function EventDetailsContent() {
  const params = useParams();
  const eventId = params.id;
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedDormer, setSelectedDormer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // State for raw data fetched from Firestore
  const [dormers, setDormers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [event, setEvent] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(user);
    if (!user || !user.uid) {
      setUserData(null);
      return;
    }

    const dormerUserRef = doc(db, "dormers", user.uid);
    const unsubscribeUser = onSnapshot(dormerUserRef, (doc) => {
      if (doc.exists()) {
        setUserData({ id: doc.id, ...doc.data() });
      } else {
        console.error("No such user found!");
        setUserData(null);
      }
    });

    return () => {
      unsubscribeUser();
    };
  }, [user]); // Add user as dependency

  // Effect for fetching data from Firestore
  useEffect(() => {
    if (!eventId) {
      console.log("No eventId provided");
      setLoading(false);
      return;
    }

    console.log("Fetching data for eventId:", eventId);
    setLoading(true);

    // 1. Fetch ALL dormers
    const dormersQuery = query(collection(db, "dormers"));
    const unsubscribeDormers = onSnapshot(dormersQuery, (snapshot) => {
      const dormerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDormers(dormerData);
    });

    // 2. Fetch event data
    const eventDocRef = doc(db, "events", eventId);
    const unsubscribeEvent = onSnapshot(eventDocRef, (doc) => {
      if (doc.exists()) {
        setEvent({ id: doc.id, ...doc.data() });
        console.log("Event data:", doc.data());
      } else {
        console.error("No such event found!");
        setEvent(null);
      }
      setLoading(false);
    });

    // 3. Fetch payments ONLY for the specific event
    const paymentsQuery = query(
      collection(db, "eventPayments"),
      where("eventId", "==", eventId)
    );
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(paymentData);
      console.log("Payments fetched:", paymentData.length);
    });

    // Cleanup function
    return () => {
      unsubscribeDormers();
      unsubscribePayments();
      unsubscribeEvent();
    };
  }, [eventId]);

  // Use useMemo to efficiently merge dormer and payment data.
  const eventDormersData = useMemo(() => {
    const paymentsMap = new Map(
      payments.map((payment) => [payment.dormerId, payment])
    );

    return dormers.map((dormer) => {
      const payment = paymentsMap.get(dormer.id);

      return {
        ...dormer,
        paymentStatus: payment?.status ?? "Unpaid",
        amountPaid: payment?.amount ?? 0.0,
        paymentDate: payment?.createdAt ?? null,
        paymentMethod: payment?.paymentMethod ?? null,
        recordedBy: payment?.recordedBy ?? null,
      };
    });
  }, [dormers, payments]);

  // Filter dormers based on search term and status
  const filteredDormers = eventDormersData.filter((dormer) => {
    const matchesSearch =
      dormer.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      dormer.lastName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      dormer.email?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || dormer.roomNumber === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalDormers = eventDormersData.length;
  const paidDormers = eventDormersData.filter(
    (dormer) => dormer.paymentStatus === "Paid"
  ).length;
  const unpaidDormers = totalDormers - paidDormers;
  const totalCollected = eventDormersData.reduce(
    (sum, dormer) => sum + (dormer.amountPaid || 0),
    0
  );

  const indexOfLastDormer = currentPage * itemsPerPage;
  const indexOfFirstDormer = indexOfLastDormer - itemsPerPage;
  const paginatedDormers = filteredDormers.slice(
    indexOfFirstDormer,
    indexOfLastDormer
  );
  const totalPages = Math.ceil(filteredDormers.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const collectionProgress =
    totalDormers > 0 ? (paidDormers / totalDormers) * 100 : 0;

  const handleLogPayment = (dormer) => {
    setSelectedDormer(dormer);
    setPaymentModalOpen(true);
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

  const handlePaymentSubmit = async (paymentData) => {
    try {
      // Check if payment already exists for this dormer and event
      const existingPaymentQuery = query(
        collection(db, "eventPayments"),
        where("dormerId", "==", paymentData.dormerId),
        where("eventId", "==", event.id)
      );

      const querySnapshot = await getDocs(existingPaymentQuery);
      let existingPaymentId = null;

      if (!querySnapshot.empty) {
        existingPaymentId = querySnapshot.docs[0].id;
      }

      const paidAmounts = payments.filter(
        (payment) => payment.dormerId === paymentData.dormerId
      );

      const origPaymentAmount = paymentData.amount;
      const paidAmountTotal = paidAmounts.reduce((sum, p) => sum + p.amount, 0);
      const updatedAmount =
        paidAmountTotal + paymentData.amount > event.amountDue
          ? event.amountDue
          : paidAmountTotal + paymentData.amount;

      const status =
        updatedAmount > 0
          ? updatedAmount >= event.amountDue
            ? "Paid"
            : "Partial"
          : "Unpaid";

      console.log("Recording event payment:", paymentData);
      paymentData.amount = updatedAmount;

      const paymentRecord = {
        ...paymentData,
        status: status,
        eventId: event.id,
        recordedBy: {
          name:
            userData != null
              ? `${userData.firstName} ${userData.lastName}`
              : "Unknown",
          email: userData.email,
        },
        updatedAt: serverTimestamp(),
      };

      if (existingPaymentId) {
        // Update existing payment
        await updateDoc(
          doc(db, "eventPayments", existingPaymentId),
          paymentRecord
        );
        toast.success("Payment updated successfully");
      } else {
        // Create new payment
        await addDoc(collection(db, "eventPayments"), paymentRecord);
        toast.success("Payment recorded successfully");
      }

      const dormerInfo = dormers.find((d) => d.id === paymentData.dormerId);
      await sendEmail({
        to: dormerInfo.email,
        subject: `${event.name} Event Payment ${
          existingPaymentId ? "Updated" : "Recorded"
        }`,
        html: `
        <h1>Event Payment ${existingPaymentId ? "Updated" : "Recorded"}</h1>
        <p>Hi ${dormerInfo.firstName},</p>
        <p>Your payment for the event <strong>${event.name}</strong> has been ${
          existingPaymentId ? "updated" : "recorded"
        }.</p>
        <p>Amount ${
          existingPaymentId ? "Added" : "Paid"
        }: <strong>₱${origPaymentAmount.toFixed(2)}</strong></p>
        <p>Total Amount Paid: <strong>₱${paymentData.amount.toFixed(
          2
        )}</strong></p>
        <p>Remaining Balance: <strong>₱${(
          event.amountDue - paymentData.amount
        ).toFixed(2)}</strong></p>
        <p>Status: <strong>${status}</strong></p>

        <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
        <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
          <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
        </div>
      `,
      });

      setPaymentModalOpen(false);
      setSelectedDormer(null);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Event Not Found</h1>
          <p className="text-gray-600 mt-2">
            The event you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/admin/events" className="mt-4 inline-block">
            <Button>Return to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            Events
          </Button>
        </Link>
        <span>/</span>
        <p className="text-gray-600">{event.name}</p>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <Badge
            variant={event.status === "Active" ? "default" : "secondary"}
            className={
              event.status === "Active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {event.status}
          </Badge>
        </div>
        <p className="text-gray-600 mt-2">{event.description}</p>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Due per Dormer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₱{event.amountDue?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Dormers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalDormers}
            </div>
            <p className="text-xs text-gray-500 mt-1">Assigned to this event</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paidDormers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {unpaidDormers} remaining • {Math.round(collectionProgress)}%
              complete
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900">
              {event.dueDate
                ? new Date(event.dueDate).toLocaleDateString()
                : "Not set"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Payment deadline</p>
          </CardContent>
        </Card>
      </div>

      <DormerFilters
        searchTerm={searchTerm}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        count={paginatedDormers.length}
        resetFilter={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      />

      {/* Dormers Payment Table */}
      <EventDormersTable
        dormers={paginatedDormers}
        onLogPayment={handleLogPayment}
        eventAmount={event.amountDue || 0}
      />

      {/* Log Payment Modal */}
      <AddEventPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        dormer={selectedDormer}
        currentUser={{
          name:
            userData != null
              ? `${userData.firstName} ${userData.lastName}`
              : "Unknown",
          email: userData != null ? userData.email : "Unknown",
          id: userData != null ? userData.id : "Unknown",
        }}
        event={event}
        onSave={handlePaymentSubmit}
      />

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
