import { toast } from "sonner";
import { ExpenseData } from "../types";

const convertToCSV = (data: ExpenseData[]): string => {
  if (!data || data.length === 0) return "";

  const header = [
    "ID",
    "Title",
    "Description",
    "Amount",
    "Category",
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

  const total = data.reduce((sum, expense) => sum + expense.amount, 0);
  const summaryRow = [
    "Total Expenses",
    "",
    "",
    total.toFixed(2),
    "",
    "",
    "",
    "",
  ].join(",");
  rows.push(summaryRow);

  return [header.join(","), ...rows].join("\n");
};

export const handleExport = (filteredExpenses: ExpenseData[]) => {
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
