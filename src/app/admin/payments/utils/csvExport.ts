import { BillData } from "../types";
import { toast } from "sonner";

export const handleExport = (filteredBills: BillData[]) => {
  if (filteredBills.length === 0) {
    toast.info("No data to export.");
    return;
  }

  const convertToCSV = (data: BillData[]): string => {
    const headers = [
      "Dormer",
      "Room",
      "Billing Period",
      "Total Due",
      "Amount Paid",
      "Remaining Balance",
      "Status",
      "Payment Dates",
    ];

    const rows = data.map((bill) => {
      const {
        dormer,
        billingPeriod,
        totalAmountDue,
        amountPaid,
        remainingBalance,
        status,
        payments,
      } = bill;
      const dormerName = `"${dormer.firstName} ${dormer.lastName}"`;
      const paymentDates = payments
        .map((p) => new Date(p.paymentDate).toLocaleDateString())
        .join("; ");

      return [
        dormerName,
        dormer.roomNumber,
        billingPeriod,
        totalAmountDue.toFixed(2),
        (amountPaid || 0).toFixed(2),
        remainingBalance.toFixed(2),
        status,
        `"${paymentDates}"`,
      ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
  };

  const csvData = convertToCSV(filteredBills);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `payments-report-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("Payments report exported successfully!");
};
