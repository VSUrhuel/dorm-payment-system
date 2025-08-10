"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  PlusIcon,
  Edit,
  FileDown,
  Mail,
} from "lucide-react";

import { firestore as db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  onSnapshot,
  runTransaction,
  serverTimestamp, // Use serverTimestamp for more accurate timestamps
} from "firebase/firestore";
import AddPayableModal from "./dormers/components/AddPayabaleModal";

import { onAuthStateChanged } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function SkeletonCard() {
  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-4 w-2/4" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

function PayableItem({ payable, onEdit }) {
  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {payable.name || "Untitled Payable"}
        </h3>
        {/* Edit button appears on hover */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onEdit(payable)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        ₱ {payable.amount.toFixed(2)}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {payable.description}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [payables, setPayables] = useState([]);
  const [user, setUser] = useState(null);
  const [showEditPayableModal, setShowEditPayableModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for raw data from Firestore
  const [expensesData, setExpensesData] = useState([]);
  const [dormersData, setDormersData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]); // Added state for payments
  const [loading, setLoading] = useState(true);

  // State for calculated dashboard values
  const [totalFunds, setTotalFunds] = useState(0);
  const [totalCollectibles, setTotalCollectibles] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalDormers, setTotalDormers] = useState(0);

  const [recentTransactions, setRecentTransactions] = useState([]);

  const [payableToEdit, setPayableToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Effect for fetching all necessary data from Firestore in real-time
  useEffect(() => {
    setLoading(true);

    const collections = {
      expenses: setExpensesData,
      dormers: setDormersData,
      bills: setBillsData,
      payments: setPaymentsData, // Added payments collection listener
    };

    const unsubscribers = Object.entries(collections).map(
      ([collectionName, setter]) => {
        const q = query(collection(db, collectionName));
        return onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setter(data);
          },
          (error) => {
            console.error(`Error fetching ${collectionName}: `, error);
            toast.error(`Failed to load ${collectionName}.`); // ✨ Error toast
            setLoading(false); // Stop loading on error
          }
        );
      }
    );

    setLoading(false);

    // Cleanup function to unsubscribe from all listeners on component unmount
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  // Effect for calculating totals whenever the source data changes
  useEffect(() => {
    // 1. Calculate Total Expenses
    // Sums the 'expenseAmount' from all documents in the expensesData array.
    const expensesSum = expensesData.reduce(
      (total, expense) => total + (expense.amount || 0),
      0
    );
    setTotalExpenses(expensesSum);

    // 2. Count Total Dormers
    // Simply gets the total number of items in the dormersData array.
    const dormerCount = dormersData.length;
    setTotalDormers(dormerCount);

    // 3. Calculate intermediate totals for funds and collectibles
    const totalAmountPaid = billsData.reduce(
      (total, bill) => total + (bill.amountPaid || 0),
      0
    );
    const totalAmountDue = billsData.reduce(
      (total, bill) => total + (bill.totalAmountDue || 0),
      0
    );

    // 4. Calculate Total Collectibles
    // The difference between the total amount due and the total amount paid.
    const collectibles = totalAmountDue - totalAmountPaid;
    setTotalCollectibles(collectibles);

    // 5. Calculate Total Fund Balance
    // The total money collected (total paid) minus the total sum of expenses.
    const funds = totalAmountPaid - expensesSum;
    setTotalFunds(funds);
  }, [expensesData, dormersData, billsData, paymentsData]); // Dependencies for recalculation

  useEffect(() => {
    setLoading(true);
    // Helper function to find dormer info safely
    const getDormerInfo = (dormerId) => {
      return dormersData.find((d) => d.id === dormerId) || {};
    };

    const getBillInfo = (billId) => {
      return billsData.find((b) => b.id === billId) || {};
    };

    // Format payments into a standardized transaction object
    const formattedPayments = paymentsData.map((payment) => {
      const dormer = getDormerInfo(payment.dormerId);
      const dormerName = `${dormer.firstName || "Unknown"} ${
        dormer.lastName || "Dormer"
      }`;
      return {
        id: payment.id,
        // Ensure date is a valid Date object; fall back to now if missing
        date: payment.createdAt?.toDate
          ? payment.createdAt.toDate()
          : new Date(),
        description: `Payment for ${
          getBillInfo(payment.billId).billingPeriod
        } paid through ${payment.paymentMethod} by ${dormerName} (Room ${
          dormer.roomNumber || "N/A"
        })`,
        amount: payment.amount,
        type: "payment",
      };
    });

    // Format expenses into a standardized transaction object
    const formattedExpenses = expensesData.map((expense) => {
      // Safely access recorder's name
      const recorderName =
        `${expense.recordedBy?.firstName || ""} ${
          expense.recordedBy?.lastName || ""
        }`.trim() || "Admin";
      return {
        id: expense.id,
        date: expense.expenseDate ? expense.expenseDate : new Date(),
        description: `${expense.category} expenses - ${expense.title}`,
        amount: expense.amount,
        type: "expense",
      };
    });

    // Combine, sort by date (most recent first), and take the top 5
    const allTransactions = [...formattedPayments, ...formattedExpenses]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    setRecentTransactions(allTransactions);
    setLoading(false);
  }, [paymentsData, expensesData, dormersData]); // This effect depends on these data arrays

  const kpiData = [
    {
      title: "Dorm Fund Balance",
      value: `₱${totalFunds
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      description: "Current available funds",
      icon: Wallet,
      trend: "up",
    },
    {
      title: "Total Collectibles",
      value: `₱${totalCollectibles
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      description: "Remaining collectibles",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Total Expenses",
      value: `₱${totalExpenses
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      description: "Overall expenses this semester",
      icon: TrendingDown,
      trend: "down",
    },
    {
      title: "Active Dormers",
      value: `${totalDormers}`,
      description: "Currently registered dormers",
      icon: Users,
      trend: "neutral",
    },
  ];

  const convertToCSV = (data) => {
    const header = [
      "Total Funds",
      "Total Collectibles",
      "Total Expenses",
      "Total Dormers",
    ];

    const rows = [
      totalFunds.toFixed(2),
      totalCollectibles.toFixed(2),
      totalExpenses.toFixed(2),
      totalDormers,
    ];

    return header.join(",") + "\n" + rows.join(",");
  };

  // New helper function to create an HTML table from your data
  const convertToHTMLTable = (data) => {
    if (!data || data.length === 0) {
      return "<p>No summary data available for this period.</p>";
    }

    // Get headers from the keys of the first object
    const headers = ["title", "value", "description"];

    // Start building the HTML table with inline styles for email client compatibility
    let table = `
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      <thead>
        <tr>
  `;

    // Add table headers
    headers.forEach((header) => {
      table += `<th style="background-color: #4CAF50; color: white; padding: 12px; border: 1px solid #ddd; text-align: left;">${header}</th>`;
    });

    table += `
        </tr>
      </thead>
      <tbody>
  `;

    // Add table rows
    data.forEach((row, index) => {
      // Style for alternating row colors
      const backgroundColor = index % 2 === 0 ? "#f2f2f2" : "#ffffff";
      table += `<tr style="background-color: ${backgroundColor};">`;
      headers.forEach((header) => {
        table += `<td style="padding: 12px; border: 1px solid #ddd; text-align: left;">${row[header]}</td>`;
      });
      table += `</tr>`;
    });

    table += `
      </tbody>
    </table>
  `;

    return table;
  };

  // Your updated function to send the report via email
  const handleEmailReport = async () => {
    try {
      toast.info("Preparing to send summary report...");

      const recipientEmails = dormersData
        .map((dormer) => dormer.email)
        .filter(Boolean);

      // If there are no valid recipients, stop here
      if (recipientEmails.length === 0) {
        toast.warn("No valid recipient emails found.");
        return;
      }

      // Convert your KPI data directly to an HTML table string
      const reportTable = convertToHTMLTable(kpiData);

      // Modern and formal HTML email template
      const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Dormitory Summary Report</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello everyone,</p>
          <p>Please see below for the latest dormitory summary report. This data provides key insights into our recent performance.</p>
          <br>
          ${reportTable}
          <br>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <p>Thank you!</p>
          <p><strong>Mabolo Management</strong></p>
        </div>
        <div style="background-color: #f2f2f2; color: #777; padding: 10px; text-align: center; font-size: 12px;">
          <p>This is an automated report. Generated on ${new Date().toLocaleDateString()}.</p>
        </div>
      </div>
    `;

      // The export sheet feature (`handleExportCSV`) is removed.
      // The email is now sent with the data embedded in the body.
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmails.join(", "),
          subject: "Dormitory Summary Report",
          html: emailHtml,
          // The 'attachments' key is completely removed
        }),
      });

      toast.success("Summary report has been emailed to all dormers!");
    } catch (error) {
      console.error("Failed to email report:", error);
      toast.error("There was a problem sending the summary report.");
    }
  };

  useEffect(() => {
    // Fetch data from API
    async function fetchPayables() {
      try {
        const queryPayable = query(collection(db, "regularCharge"));
        const unsubscribe = onSnapshot(queryPayable, (snapshot) => {
          const payablesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPayables(payablesData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching payables:", error);
      }
    }
    fetchPayables();
  }, []);

  const handleAddPayable = () => {
    setPayableToEdit(null); // Clear any existing payable to edit
    setIsAddModalOpen(true); // Open the modal for adding a new payable
  };

  const handleEditPayable = (payable) => {
    setPayableToEdit(payable); // Set the payable to edit
    setIsAddModalOpen(true); // Open the modal for editing
  };

  const handleSavePayable = async (payableData) => {
    try {
      if (payableData.id) {
        const docRef = doc(db, "regularCharge", payableData.id);
        await setDoc(docRef, payableData, { merge: true });
        toast.success("Payable Updated Successfully!");
      } else {
        await addDoc(collection(db, "regularCharge"), payableData);
        toast.success("New Payable Added Successfully!");
      }
      setIsAddModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error saving payable:", error);
      toast.error("Failed to save payable. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Payables Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/5 mt-2" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Recent Transactions Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-5 w-1/5" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-1/5" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-5 w-1/5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1 justify-between flex flex-col md:flex-row">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Real-time financial status of your dormitory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50"
            onClick={handleEmailReport}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={index}
              className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {kpi.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg ${
                    kpi.trend === "up"
                      ? "bg-green-50 dark:bg-green-900/30"
                      : kpi.trend === "down"
                      ? "bg-red-50 dark:bg-red-900/30"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      kpi.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : kpi.trend === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white md:text-xl">
              Regular Payables
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Recurring monthly expenses
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => handleAddPayable()}
            className="gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50"
          >
            <PlusIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            Add Payable
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
            {payables.map((payable) => (
              <PayableItem
                key={payable.id}
                payable={payable}
                onEdit={handleEditPayable} // Pass the edit handler
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <AddPayableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSavePayable}
        payable={payableToEdit}
      />

      {/* Recent Activity */}
      <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* ✨ Renders the new dynamic list */}
                {recentTransactions.map((activity) => (
                  <TableRow
                    key={activity.id} // Use unique ID from Firestore doc
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium ${
                          activity.type === "payment"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {/* Dynamically add '+' or '-' sign */}
                        {activity.type === "payment" ? "+" : "-"}₱
                        {activity.amount.toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
