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

// Sample data - replace with your Firebase data
const expensesData = [
  {
    id: 1,
    title: "Dorm Cleaning Materials",
    description:
      "Purchased cleaning supplies including detergent, floor cleaner, and disinfectant for monthly deep cleaning",
    amount: 450.75,
    expenseDate: "2024-01-15",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Admin User",
      email: "admin@dormitory.com",
      id: "admin1",
    },
    category: "Maintenance",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Electricity Bill Payment",
    description: "Monthly electricity bill payment for the dormitory building",
    amount: 2850.0,
    expenseDate: "2024-01-10",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Finance Manager",
      email: "finance@dormitory.com",
      id: "finance1",
    },
    category: "Utilities",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: 3,
    title: "Water Bill Payment",
    description: "Monthly water and sewerage bill for dormitory facilities",
    amount: 1200.5,
    expenseDate: "2024-01-08",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Admin User",
      email: "admin@dormitory.com",
      id: "admin1",
    },
    category: "Utilities",
    createdAt: "2024-01-08T09:15:00Z",
  },
  {
    id: 4,
    title: "Security System Maintenance",
    description:
      "Annual maintenance and inspection of CCTV cameras and security equipment",
    amount: 3500.0,
    expenseDate: "2024-01-05",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Maintenance Staff",
      email: "maintenance@dormitory.com",
      id: "maintenance1",
    },
    category: "Security",
    createdAt: "2024-01-05T16:45:00Z",
  },
  {
    id: 5,
    title: "Kitchen Equipment Repair",
    description:
      "Repair of common kitchen refrigerator and replacement of damaged microwave",
    amount: 2200.0,
    expenseDate: "2024-01-03",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Admin User",
      email: "admin@dormitory.com",
      id: "admin1",
    },
    category: "Maintenance",
    createdAt: "2024-01-03T11:30:00Z",
  },
  {
    id: 6,
    title: "Internet Service Payment",
    description:
      "Monthly internet service provider payment for high-speed WiFi",
    amount: 1899.0,
    expenseDate: "2024-01-01",
    receiptImage: "/placeholder.svg?height=200&width=300",
    recordedBy: {
      name: "Finance Manager",
      email: "finance@dormitory.com",
      id: "finance1",
    },
    category: "Utilities",
    createdAt: "2024-01-01T08:00:00Z",
  },
];

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

  console.log(" Expenses:", expensesData);
  console.log("Filtered Expenses:", filteredExpenses);

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
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const monthlyExpenses = filteredExpenses
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

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategory = Object.keys(expensesByCategory).reduce(
    (a, b) => (expensesByCategory[a] > expensesByCategory[b] ? a : b),
    "N/A"
  );

  const handleViewExpenseDetails = (expense) => {
    console.log("View expense details:", expense);
    setSelectedExpense(expense);
    setIsOpenViewEditExpenseModal(true);
    console.log("Sope");
  };

  const handleEditExpense = (expense) => {
    console.log("Edit expense:", expense);
    setSelectedExpense(expense);
    setIsOpenViewEditExpenseModal(true);
  };

  const handleAddExpense = async (expenseData) => {
    console.log("Add new expense:", expenseData);
    if (!user) {
      alert("You must be logged in to add an expense.");
      return;
    }
    try {
      const expenseExist = expensesData.find(
        (expense) => expense.title === expenseData.title
      );
      if (expenseExist) {
        alert("An expense with this title already exists.");
        return;
      }
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        recordedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      alert("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
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
      alert("Expense updated successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <ExpensesHeader setAddExpenseModalOpen={setAddExpenseModalOpen} />

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
        onEditExpense={handleEditExpense}
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
