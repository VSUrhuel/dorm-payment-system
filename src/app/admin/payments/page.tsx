"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import PaymentsTable from "./components/PaymentsTable";
import PaymentDetailsModal from "./components/ListOfPaymentsModal";
import PaymentModal from "../dormers/components/PaymentModal";
import PaymentHeader from "./components/PaymentHeader";
import SummaryCards from "./components/SummaryCards";
import PaymentsFilter from "./components/PaymentsFilter";
import { PaymentsPageSkeleton } from "./components/PaymentsPageSkeleton";
import { usePaymentsData } from "./hooks/usePaymentsData";
import { usePaymentActions } from "./hooks/usePaymentActions";
import { BillData } from "./types";
import { Dormer } from "../dormers/types";

export default function PaymentsContent() {
  const [user, setUser] = useState<User | null>(null);
  const {
    loading,
    paginatedBills,
    uniqueBillingPeriods,
    filteredBills,
    summaryStats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    billingPeriodFilter,
    setBillingPeriodFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = usePaymentsData();

  const { handleRecordPayment } = usePaymentActions(
    paginatedBills.map((b) => b.dormer)
  );

  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleViewDetails = (bill: BillData) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const openPaymentModalForBill = (bill: BillData) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  if (loading) {
    return <PaymentsPageSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PaymentHeader />

      <SummaryCards
        totalAmountDue={summaryStats.totalAmountDue}
        totalAmountPaid={summaryStats.totalAmountPaid}
        totalRemainingBalance={summaryStats.totalRemainingBalance}
      />

      <PaymentsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        billingPeriodFilter={billingPeriodFilter}
        setBillingPeriodFilter={setBillingPeriodFilter}
        billingPeriods={uniqueBillingPeriods}
        paginatedBills={paginatedBills}
        filteredBills={filteredBills}
        setCurrentPage={setCurrentPage}
      />

      <PaymentsTable
        bills={paginatedBills}
        onViewDetails={handleViewDetails}
        onRecordPayment={openPaymentModalForBill}
      />

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={selectedBill}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        bill={selectedBill}
        dormer={selectedBill?.dormer as Dormer | null}
        onSavePayment={async (paymentData) => {
          await handleRecordPayment(paymentData, user);
          closePaymentModal();
        }}
      />

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={undefined}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={undefined}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
