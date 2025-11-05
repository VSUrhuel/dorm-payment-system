"use client";

import { useState } from "react";
import { useDormers } from "./hooks/useDormers";
import { useDormerActions } from "./hooks/useDormerActions";
import { useModal } from "./hooks/useModal";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import DormerHeader from "./components/DormerHeader";
import DormerFilters from "./components/DormerFilters";
import DormersTable from "./components/DormersTable";
import AddDormerModal from "./components/AddDormerModal";
import BillsModal from "./components/BillsModal";
import PaymentModal from "./components/PaymentModal";
import GenerateBillModal from "./components/GenerateBillModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DormersPageSkeleton } from "./components/DormersPageSkeleton";
import { Bill } from "./types";
import { Delete } from "lucide-react";
import DeleteDormerModal from "./components/DeleteDormerModal";
import { handleExport } from "./utils/csvExport";

export default function DormersPage() {
  const [user, setUser] = useState<User | null>(null);
  const {
    dormers,
    bills,
    payables,
    loading,
    paginatedDormers,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleNextPage,
    handlePreviousPage,
  } = useDormers();

  const {
    saveDormer,
    handleSavePayment,
    saveBill,
    deleteDormer,
    isSubmitting,
  } = useDormerActions(dormers, bills);

  const { modal, selectedDormer, selectedBill, openModal, closeModal } =
    useModal();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [billToCreate, setBillToCreate] = useState<Bill | null>(null);

  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  });

  if (loading) {
    return <DormersPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 space-y-6">
      <DormerHeader
        onAddDormer={() => openModal("add")}
        onExport={() => handleExport(dormers)}
      />

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

      <DormersTable
        dormers={paginatedDormers}
        onGenerateBill={(dormer) => openModal("generateBill", dormer)}
        onViewBills={(dormer) => openModal("bills", dormer)}
        onDelete={(dormer) => openModal("deleteDormer", dormer)}
        hasFilters={searchTerm !== "" || statusFilter !== "All"}
        onResetFilters={() => {
          setSearchTerm("");
          setStatusFilter("All");
        }}
      />

      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </Button>
        </div>
      </div>

      <AddDormerModal
        isOpen={modal === "add"}
        onClose={closeModal}
        onSave={(dormerData) => saveDormer(dormerData, user)}
      />

      <BillsModal
        isOpen={modal === "bills"}
        onClose={closeModal}
        dormer={selectedDormer}
        onRecordPayment={(bill: Bill) =>
          openModal("payment", selectedDormer, bill)
        }
      />

      <PaymentModal
        isOpen={modal === "payment"}
        onClose={closeModal}
        dormer={selectedDormer}
        bill={selectedBill}
        onSavePayment={async (paymentData) => {
          await handleSavePayment(paymentData, user);
          closeModal();
        }}
      />

      <DeleteDormerModal
        isOpen={modal === "deleteDormer"}
        onClose={closeModal}
        dormer={selectedDormer}
        onConfirm={async (dormerId) => {
          await deleteDormer(dormerId);
        }}
      />

      <GenerateBillModal
        isOpen={modal === "generateBill"}
        onClose={closeModal}
        dormer={selectedDormer}
        onGenerateBill={(billData) => saveBill(billData, user)}
        payables={payables}
        bills={bills}
        setShowConfirmDialog={setShowConfirmDialog}
        setBillToCreate={setBillToCreate}
        setShowErrorModal={setShowErrorModal}
      />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-red-100 text-red-800">
          <DialogTitle className={undefined}>
            Overwrite Existing Bill?
          </DialogTitle>
          <DialogDescription className={undefined}>
            A bill for this dormer and billing period already exists. Do you
            want to overwrite it with the new data?
          </DialogDescription>
          <DialogFooter className={undefined}>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
              className={undefined}
              size={undefined}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => saveBill(billToCreate, user)}
              disabled={isSubmitting}
              variant={undefined}
              size={undefined}
            >
              {isSubmitting ? "Overwriting..." : "Overwrite Bill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        className="bg-red-100 text-red-800"
      >
        <DialogContent className={undefined}>
          <DialogTitle className={undefined}>Error</DialogTitle>
          <DialogDescription className={undefined}>
            An existing payment for this bill already exists. You cannot
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
