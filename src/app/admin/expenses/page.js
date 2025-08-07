"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Search, Filter, Plus } from "lucide-react";
import ExpensesTable from "./components/ExpensesTable";
import AddExpenseModal from "./components/AddExpenseModal";
import ExpensesHeader from "./components/ExpensesHeader";
import SummaryExpense from "./components/SummaryExpenses";
import ExpensesFilter from "./components/ExpensesFilter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ServerInsertedHtml } from "next/dist/server/route-modules/app-page/vendored/contexts/entrypoints";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore as db } from "@/lib/firebase";
import ViewEditExpenseModal from "./components/ViewEditExpenseModal";
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

function ExpensesPageSkeleton() {
  const skeletonRows = Array(6).fill(0); // Create 6 skeleton rows for the table

  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>

      {/* Filters Skeleton */}
      <div className="p-4 border rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-2/3" />
          <Skeleton className="h-10 w-full md:w-1/3" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-40" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-5 w-32" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Skeleton className="h-5 w-28" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ExpensesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [expensesData, setExpensesData] = useState([]);
  const [dormersData, setDormersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpenViewEditExpenseModal, setIsOpenViewEditExpenseModal] =
    useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    const qExpenses = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(qExpenses, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpensesData(expenses);
      setLoading(false);
    });

    const qDormers = query(collection(db, "dormers"));
    const unsubscribeDormers = onSnapshot(qDormers, (snapshot) => {
      const dormers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDormersData(dormers);
    });
    return () => {
      unsubscribe();
      unsubscribeDormers();
    };
  }, []);

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const header = [
      "ID",
      "Title",
      "Category",
      "Amount",
      "Description",
      "Receipt URL",
      "Expense Date",
      "Recorded By",
    ];

    const rows = data.map((expense) =>
      [
        expense.id,
        `"${expense.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.amount,
        expense.category,
        expense.receiptImageUrl || "N/A",
        expense.expenseDate,
        `"${expense.recordedBy?.firstName || "N/A"} ${
          expense.recordedBy?.lastName || ""
        }"`,
      ].join(",")
    );

    const summaryRow = [
      "Total Expenses",
      "",
      "",
      data.reduce((sum, expense) => sum + expense.amount, 0),
      "",
      "",
      "",
      "",
    ].join(",");

    rows.push(summaryRow);

    return [header.join(","), ...rows].join("\n");
  };

  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      toast.info("No expense data to export.");
      return;
    }
    const csvData = convertToCSV(filteredExpenses);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Expense report exported successfully!");
  };

  // --- 3. FUNCTION TO HANDLE SENDING THE EMAIL REPORT ---
  const handleSendExpenseReport = async () => {
    if (!dormersData || dormersData.length === 0) {
      toast.error("No dormer emails available to send the report to.");
      return;
    }
    if (filteredExpenses.length === 0) {
      toast.info("No expense data to send.");
      return;
    }

    setIsSendingEmail(true);
    toast.info("Sending expense report...");
    try {
      // Get all dormer emails, filtering out any invalid ones
      const recipientEmails = dormersData
        .map((dormer) => dormer.email)
        .filter(Boolean);

      const csvData = convertToCSV(filteredExpenses);

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmails.join(", "), // Send to all dormers
          subject: "Dormitory Expense Report",
          html: `
            <h1>Dormitory Expense Report</h1>
            <p>Hello everyone,</p>
            <p>Please find the latest expense report attached to this email.</p>
             <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
              <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
                <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
                <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
            </div>
          `,
          attachments: [
            {
              filename: `expenses-report-${
                new Date().toISOString().split("T")[0]
              }.csv`,
              content: csvData,
              contentType: "text/csv",
            },
          ],
        }),
      });

      toast.success("Expense report has been emailed to all dormers!");
    } catch (error) {
      console.error("Failed to email report:", error);
      toast.error("There was a problem sending the email report.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const combinedBillUserData = useMemo(() => {
    if (!dormersData || !expensesData) return [];
    return expensesData.map((expense) => {
      const dormer = dormersData.find((d) => d.id === expense.recordedBy);
      return {
        ...expense,
        recordedBy: dormer ? { ...dormer } : expense.recordedBy,
      };
    });
  }, [dormersData, expensesData]);

  // Filter expenses based on search and category
  const filteredExpenses = combinedBillUserData.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastExpense = currentPage * itemsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

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

  // Calculate summary statistics
  const totalExpenses = combinedBillUserData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const monthlyExpenses = combinedBillUserData
    .filter((expense) => {
      const expenseDate = new Date(expense.expenseDate);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = combinedBillUserData.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategory = Object.keys(expensesByCategory).reduce(
    (a, b) => (expensesByCategory[a] > expensesByCategory[b] ? a : b),
    "N/A"
  );

  const handleViewExpenseDetails = (expense) => {
    setSelectedExpense(expense);
    setIsOpenViewEditExpenseModal(true);
  };

  const handleAddExpense = async (expenseData) => {
    console.log("Add new expense:", expenseData);
    if (!user) {
      toast.error("You must be logged in to add an expense.");
      return;
    }
    try {
      const expenseExist = expensesData.find(
        (expense) => expense.title === expenseData.title
      );
      if (expenseExist) {
        toast.error("An expense with this title already exists.");
        return;
      }
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        recordedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    }

    setAddExpenseModalOpen(false);
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const expenseRef = doc(db, "expenses", expenseData.id);
      await updateDoc(expenseRef, {
        ...expenseData,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense. Please try again.");
    }
  };

  if (loading) {
    return <ExpensesPageSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <ExpensesHeader
        setAddExpenseModalOpen={setAddExpenseModalOpen}
        onExport={handleExport}
        onEmailReport={handleSendExpenseReport}
      />

      {/* Summary Cards */}
      <SummaryExpense
        totalExpenses={totalExpenses}
        monthlyExpenses={monthlyExpenses}
        topCategory={topCategory}
        expensesByCategory={expensesByCategory}
      />

      {/* Filters */}
      <ExpensesFilter
        setSearchTerm={setSearchTerm}
        setCategoryFilter={setCategoryFilter}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        paginatedExpenses={paginatedExpenses}
        filteredExpenses={filteredExpenses}
      />

      {/* Expenses Table */}
      <ExpensesTable
        expenses={paginatedExpenses}
        onViewDetails={handleViewExpenseDetails}
      />

      {/* View Edit Expense Modal */}
      <ViewEditExpenseModal
        isOpen={isOpenViewEditExpenseModal}
        onClose={() => setIsOpenViewEditExpenseModal(false)}
        onSave={handleUpdateExpense}
        expense={selectedExpense}
      />

      {/* Pagination */}
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

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}
