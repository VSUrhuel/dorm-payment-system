"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore as db } from "../../../../lib/firebase";
import { Dormer } from "../../dormers/types";
import { Expense, ExpenseData, SummaryStats } from "../types";
import { toast } from "sonner";

export function useExpensesData() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dormers, setDormers] = useState<Dormer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const qExpenses = query(collection(db, "expenses"));
    const unsubscribeExpenses = onSnapshot(
      qExpenses,
      (snapshot) => {
        const expensesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Expense)
        );
        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses data.");
        setLoading(false);
      }
    );

    const qDormers = query(collection(db, "dormers"));
    const unsubscribeDormers = onSnapshot(
      qDormers,
      (snapshot) => {
        const dormersData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Dormer)
        );
        setDormers(dormersData);
      },
      (error) => {
        console.error("Error fetching dormers:", error);
        toast.error("Failed to load dormer data.");
      }
    );

    return () => {
      unsubscribeExpenses();
      unsubscribeDormers();
    };
  }, []);

  const combinedExpensesData: ExpenseData[] = useMemo(() => {
    if (loading || !expenses.length || !dormers.length) return [];
    const dormersMap = new Map(dormers.map((d) => [d.id, d]));
    return expenses
      .map((expense) => {
        const dormer =
          typeof expense.recordedBy === "string"
            ? dormersMap.get(expense.recordedBy)
            : (expense.recordedBy as Dormer);
        return {
          ...expense,
          recordedBy:
            dormer || ({ firstName: "Unknown", lastName: "User" } as Dormer),
        };
      })
      .filter(Boolean) as ExpenseData[];
  }, [loading, expenses, dormers]);

  const filteredExpenses = useMemo(() => {
    return combinedExpensesData.filter((expense) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        expense.title.toLowerCase().includes(searchLower) ||
        expense.description.toLowerCase().includes(searchLower) ||
        `${expense.recordedBy.firstName} ${expense.recordedBy.lastName}`
          .toLowerCase()
          .includes(searchLower);
      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [combinedExpensesData, searchTerm, categoryFilter]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const summaryStats: SummaryStats = useMemo(() => {
    const totalExpenses = combinedExpensesData.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const monthlyExpenses = combinedExpensesData
      .filter((exp) => {
        const expenseDate = new Date(exp.expenseDate);
        const now = new Date();
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const expensesByCategory = combinedExpensesData.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.keys(expensesByCategory).reduce(
      (a, b) => (expensesByCategory[a] > expensesByCategory[b] ? a : b),
      "N/A"
    );

    return { totalExpenses, monthlyExpenses, topCategory, expensesByCategory };
  }, [combinedExpensesData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return {
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
    setCurrentPage,
  };
}
