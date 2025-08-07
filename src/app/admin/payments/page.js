"use client";

import { useState, useMemo, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  doc,
  runTransaction,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase"; // Assuming 'db' is exported as 'firestore'
// import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook for the user
// import { sendEmail } from "@/utils/email"; // Assuming you have an email utility

import { Button } from "@/components/ui/button";
import PaymentsTable from "./components/PaymentsTable";
import PaymentDetailsModal from "./components/ListOfPaymentsModal";
import PaymentModal from "../dormers/components/PaymentModal";
import PaymentHeader from "./components/PaymentHeader";
import SummaryCards from "./components/SummaryCards";
import PaymentsFilter from "./components/PaymentsFilter";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import {
  TableCell,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
} from "@/components/ui/table";

function PaymentsPageSkeleton() {
  const skeletonRows = Array(6).fill(0);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-48" />

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>

      {/* Filters Skeleton */}
      <div className="p-4 border rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-1/4" />
          <Skeleton className="h-10 w-full md:w-1/4" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-5 w-20" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Skeleton className="h-5 w-28" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-36 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function PaymentsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [billingPeriodFilter, setBillingPeriodFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [dormers, setDormers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Assuming you have a user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- 1. FIXED: Data fetching logic ---
  // This useEffect now correctly waits for all three data streams to load
  // before setting the main loading state to false, preventing race conditions.
  useEffect(() => {
    const collections = {
      payments: { setter: setPayments, loaded: false },
      bills: { setter: setBills, loaded: false },
      dormers: { setter: setDormers, loaded: false },
    };

    const checkAllLoaded = () => {
      if (Object.values(collections).every((c) => c.loaded)) {
        setLoading(false);
      }
    };

    const unsubscribers = Object.keys(collections).map((key) => {
      const q = query(collection(firestore, key));
      return onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          collections[key].setter(data);
          collections[key].loaded = true;
          checkAllLoaded();
        },
        (error) => {
          console.error(`Error fetching ${key}:`, error);
          toast.error(`Failed to load ${key} data.`);
          setLoading(false); // Stop loading on error to prevent infinite spinners
        }
      );
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  // --- 2. OPTIMIZED: Data combination logic ---
  // This memoized function now uses Maps for efficient lookups (O(1) average),
  // which is much faster than nested .find() calls (O(n)) inside a loop.
  const combinedBillData = useMemo(() => {
    if (loading || !bills.length || !dormers.length) {
      return [];
    }

    // Create lookup maps for performance
    const dormersMap = new Map(dormers.map((d) => [d.id, d]));
    const paymentsByBill = payments.reduce((acc, payment) => {
      if (!acc[payment.billId]) {
        acc[payment.billId] = [];
      }
      acc[payment.billId].push(payment);
      return acc;
    }, {});

    return bills
      .map((bill) => {
        const dormer = dormersMap.get(bill.dormerId);
        if (!dormer) return null; // Skip bill if dormer not found

        const associatedPayments = (paymentsByBill[bill.id] || []).map((p) => ({
          ...p,
          recordedByUser: dormersMap.get(p.recordedBy), // Attach user info to each payment
        }));

        const totalPaidForBill = associatedPayments.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        const remainingBalance = bill.totalAmountDue - totalPaidForBill;

        return {
          ...bill,
          remainingBalance,
          dormer,
          payments: associatedPayments,
        };
      })
      .filter(Boolean); // Remove any null entries
  }, [loading, payments, bills, dormers]);

  const uniqueBillingPeriods = useMemo(() => {
    if (!combinedBillData.length) return [];
    // Use a Set for efficiency to get unique values, then convert to array and sort
    return [
      ...new Set(combinedBillData.map((bill) => bill.billingPeriod)),
    ].sort();
  }, [combinedBillData]);

  // --- 3. FIXED: Dependency array for filtering ---
  const filteredBills = useMemo(() => {
    return combinedBillData.filter((bill) => {
      if (!bill.dormer) return false;
      const matchesSearch =
        `${bill.dormer.firstName} ${bill.dormer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        bill.dormer.roomNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        bill.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter;

      const matchesBillingPeriod =
        billingPeriodFilter === "All" ||
        bill.billingPeriod === billingPeriodFilter;

      return matchesSearch && matchesStatus && matchesBillingPeriod;
    });
  }, [searchTerm, statusFilter, billingPeriodFilter, combinedBillData]); // Added combinedBillData dependency

  // Pagination calculations
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Summary statistics calculation
  const { totalAmountDue, totalAmountPaid, totalRemainingBalance } =
    useMemo(() => {
      return combinedBillData.reduce(
        (acc, bill) => {
          const amountPaid = bill.totalAmountDue - bill.remainingBalance;
          acc.totalAmountDue += bill.totalAmountDue;
          acc.totalAmountPaid += amountPaid;
          acc.totalRemainingBalance += bill.remainingBalance;
          return acc;
        },
        { totalAmountDue: 0, totalAmountPaid: 0, totalRemainingBalance: 0 }
      );
    }, [combinedBillData]);

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const openPaymentModalForBill = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
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

      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send payment confirmation email.");
    }
  };

  // --- 4. FIXED: handleRecordPayment function ---
  const handleRecordPayment = async (paymentData) => {
    // Replace with your actual user object from context or auth hook
    const userData = { uid: user.uid };
    if (!userData || !paymentData.billId) {
      console.error(
        "Authentication or data error: User or Bill ID is missing."
      );
      return;
    }

    const billRef = doc(firestore, "bills", paymentData.billId);

    try {
      await runTransaction(firestore, async (transaction) => {
        const billDoc = await transaction.get(billRef);
        if (!billDoc.exists()) {
          throw new Error("Bill document does not exist!");
        }

        const currentBillData = billDoc.data();
        const currentAmountPaid = currentBillData.amountPaid || 0;
        const totalAmountDue = currentBillData.totalAmountDue;

        // Ensure payment doesn't exceed total due
        const newPaymentAmount = paymentData.amount;
        const newAmountPaid = Math.min(
          totalAmountDue,
          currentAmountPaid + newPaymentAmount
        );

        let newStatus = "Partially Paid";
        if (newAmountPaid >= totalAmountDue) {
          newStatus = "Paid";
        }

        // Add a new document to the 'payments' collection
        await addDoc(collection(firestore, "payments"), {
          ...paymentData,
          recordedBy: user.uid,
          createdAt: serverTimestamp(),
        });

        // Update the bill document within the transaction
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
            <p>Thank you!</p>
          `,
        });
      }
    } catch (error) {
      console.error("Error saving payment in transaction: ", error);
      toast.error(`Payment recording failed!`);
    } finally {
      setIsPaymentModalOpen(false); // Correctly close the modal
    }
  };

  if (loading) {
    return <PaymentsPageSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PaymentHeader />

      <SummaryCards
        totalAmountDue={totalAmountDue}
        totalAmountPaid={totalAmountPaid}
        totalRemainingBalance={totalRemainingBalance}
      />

      <PaymentsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        // PASS the new props to the filter component
        billingPeriodFilter={billingPeriodFilter}
        setBillingPeriodFilter={setBillingPeriodFilter}
        billingPeriods={uniqueBillingPeriods}
        paginatedBills={paginatedBills}
        filteredBills={filteredBills}
      />

      {/* --- 5. FIXED: Props passed to table --- */}
      <PaymentsTable
        bills={paginatedBills}
        onViewDetails={handleViewDetails}
        onRecordPayment={openPaymentModalForBill} // Use a specific handler to open the modal
      />

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={selectedBill}
      />

      {/* --- 6. FIXED: Props passed to modal --- */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={selectedBill}
        dormer={selectedBill?.dormer} // Pass the dormer object directly from the selected bill
        onSavePayment={handleRecordPayment}
      />

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages || 1}
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
