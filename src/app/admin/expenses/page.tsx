"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import ExpensesTable from "./components/ExpensesTable";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpensesHeader from "./components/ExpensesHeader";
import SummaryExpense from "./components/SummaryExpenses";
import ExpensesFilter from "./components/ExpensesFilter";
import ViewEditExpenseModal from "./components/ViewEditExpenseModal";
import { ExpensesPageSkeleton } from "./components/ExpensePageSkeleton";
import { useExpensesData } from "./hooks/useExpensesData";
import { useExpenseActions } from "./hooks/useExpensesAction";
import { ExpenseData } from "./types";
import { handleExport } from "./utils/csvUtils";
import { handleSendExpenseReport } from "./utils/emailUtils";

export default function ExpensesContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    loading,
    paginatedExpenses,
    filteredExpenses,
    dormers,
    summaryStats,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    handleNextPage,
    handlePreviousPage,
  } = useExpensesData();

  const { isSubmitting, handleAddExpense, handleUpdateExpense } =
    useExpenseActions(filteredExpenses);

  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [viewEditModalOpen, setViewEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubscribe();
  }, []);

  const handleViewDetails = (expense: ExpenseData) => {
    setSelectedExpense(expense);
    setViewEditModalOpen(true);
  };

  if (loading) {
    return <ExpensesPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
      <ExpensesHeader
        onAdd={() => setAddExpenseModalOpen(true)}
        onExport={() => handleExport(filteredExpenses)}
        onEmailReport={() =>
          handleSendExpenseReport(filteredExpenses, dormers, setIsSendingEmail)
        }
        isSendingEmail={isSendingEmail}
      />

      <SummaryExpense {...summaryStats} />

      <ExpensesFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        paginatedExpenses={paginatedExpenses}
        filteredExpenses={filteredExpenses}
      />

      <ExpensesTable
        expenses={paginatedExpenses}
        onViewDetails={handleViewDetails}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 sm:py-4">
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          Page {currentPage} of {totalPages || 1}
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

      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onSave={(data) => handleAddExpense(data, user)}
      />

      <ViewEditExpenseModal
        isOpen={viewEditModalOpen}
        onClose={() => setViewEditModalOpen(false)}
        onSave={(data) => handleUpdateExpense(data, user)}
        expense={selectedExpense}
      />
    </div>
  );
}
