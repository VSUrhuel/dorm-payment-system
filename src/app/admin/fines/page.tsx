"use client";

import { useEffect, useState } from "react";
import { useFinesData } from "./hooks/useFinesData";
import { useFinesActions } from "./hooks/useFinesAction";
import { useModal } from "./hooks/useModal";
import { BillFines, PaymentFines } from "./types";
import { onAuthStateChanged, User } from "firebase/auth";
import { FinesPageSkeleton } from "./components/FinesPageSkeleton";
import FinesHeader from "./components/FinesHeader";
import DormerFilters from "../dormers/components/DormerFilters";
import FinesTable from "./components/FinesTable";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import GenerateFinesModal from "./components/GenerateFinesModal";
import FinesModal from "./components/FinesModal";
import FinePaymentModal from "./components/FinePaymentModal";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FinesSummary from "./components/FinesSummary";

export default function FinesPage() {
  const {
    fines,
    loading,
    summary,
    paginatedDormers,
    payableFines,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleNextPage,
    handlePreviousPage,
  } = useFinesData();

  const {
    saveFine,
    handleSavePayment,
    isSubmitting,
  } = useFinesActions();

  const { modal, selectedDormer: rawSelectedDormer, selectedFinePayment, openModal, closeModal } =
    useModal();
  // Cast selectedDormer to the extended type expected by FinesModal
  const selectedDormer = rawSelectedDormer as (any & { fines: PaymentFines[] }) | null;

  const { ConfirmDialog, confirm } = useConfirmDialog();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fineToCreate, setFineToCreate] = useState<BillFines | null>(null);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !summary) {
    return <FinesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
      <ConfirmDialog />
      <FinesHeader />
        <FinesSummary totalFines={summary?.totalFines} collectedFines={summary?.collectedFines} collectibleFines={summary?.collectibleFines} />
      <DormerFilters
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        count={paginatedDormers.length}
        resetFilter={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      />

      <FinesTable
        dormers={paginatedDormers}
        onGenerateFines={(dormer) => openModal("generateBill", dormer)}
        onViewFines={(dormer) => openModal("bills", dormer)}
        hasFilters={searchTerm !== "" || statusFilter !== "All"}
        onResetFilters={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 sm:py-4">
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex-1 sm:flex-none border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex-1 sm:flex-none border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
      </div>

      <FinesModal
        isOpen={modal === "bills"}
        onClose={closeModal}
        dormer={selectedDormer}
        onRecordPayment={(fine: PaymentFines) =>
          openModal("payment", selectedDormer, fine)
        }
      />

      <FinePaymentModal
        isOpen={modal === "payment"}
        onClose={closeModal}
        dormer={selectedDormer}
        fine={selectedFinePayment}
        onSavePayment={async (paymentData) => {
          await handleSavePayment(paymentData, user);
          closeModal();
        }}
      />

      <GenerateFinesModal
        isOpen={modal === "generateBill"}
        onClose={closeModal}
        isSubmmitting={isSubmitting}
        dormer={selectedDormer}
        payables={payableFines} // You might need to fetch fines/payables here
        paymentFines={fines}
        onGenerateFine={async (fineData) => {await saveFine(fineData, user); closeModal();}}
        setFineToCreate={setFineToCreate}
        setShowErrorModal={setShowErrorModal}
      />

      <Dialog
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        className="bg-red-100 text-red-800"
      >
        <DialogContent className={undefined}>
          <DialogTitle className={undefined}>Error</DialogTitle>
          <DialogDescription className={undefined}>
            An existing payment for this fine already exists. You cannot
            override or delete it.
          </DialogDescription>
          <DialogFooter className={undefined}>
            <Button
              onClick={() => setShowErrorModal(false)}
              className={undefined}
              variant={undefined}
              size={undefined}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
