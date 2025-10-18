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
    <div className="p-4 md:p-6 space-y-6">
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          className={undefined}
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          className={undefined}
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
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
