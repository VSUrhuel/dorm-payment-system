"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./../../components/ui/card";
import { Button } from "./../../components/ui/button";
import { Badge } from "./../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table";
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

import { firestore as db, auth } from "./../../lib/firebase";
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
import { Skeleton } from "./../../components/ui/skeleton";
import { toast } from "sonner";
import { formatAmount } from "./expenses/utils";

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
    <div className="group relative rounded-xl border-2 border-gray-100 bg-gradient-to-br from-white to-[#A5D6A7]/5 p-5 shadow-sm transition-all hover:scale-[1.02]">
      {/* accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2E7D32] to-[#A5D6A7] rounded-l-xl"></div>
      
      <div className="flex items-start justify-between pl-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-[#A5D6A7]/30">
              <Wallet className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <h3 className="text-sm font-bold text-[#333333] group-hover:text-[#2E7D32] transition-colors">
              {payable.name || "Untitled Payable"}
            </h3>
          </div>
          <p className="text-3xl font-extrabold text-[#2E7D32] mb-2 tracking-tight">
            ₱{payable.amount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {payable.description}
          </p>
        </div>

        {/* Edit button appears on hover */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2E7D32] hover:text-white -mt-1 -mr-1"
          onClick={() => onEdit(payable)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
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
      if (!currentUser) {
        // If no user is found, redirect to the login page
        window.location.href = "/";
      } else {
        setUser(currentUser);
      }
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
            // If fetching dormers, filter by role 'User'
            if (collectionName === "dormers") {
              setter(data.filter((d) => d.role === "User"));
            } else {
              setter(data);
            }
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
      (total, expense) => total + parseFloat(expense.amount || 0),
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
      value: `₱${formatAmount(totalFunds || 0)}`,
      description: "Current available funds",
      icon: Wallet,
      trend: "up",
    },
    {
      title: "Total Collectibles",
      value: `₱${formatAmount(totalCollectibles || 0)}`,
      description: "Remaining collectibles",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Total Expenses",
      value: `₱${formatAmount(totalExpenses || 0)}`,
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
    <div className="min-h-screen bg-[#f0f0f0] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2 justify-between flex flex-col md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm md:text-base text-[#12372A] mt-1">
            Real-time financial status of your dormitory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all"
            onClick={handleEmailReport}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={index}
              className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div
                  className={`p-2.5 rounded-xl ${
                    kpi.trend === "up"
                      ? "bg-[#A5D6A7]"
                      : kpi.trend === "down"
                      ? "bg-red-100"
                      : "bg-[#E0E0E0]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      kpi.trend === "up"
                        ? "text-[#2E7D32]"
                        : kpi.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-[#333333]">
                  {kpi.value}
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1.5">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-gray-100 shadow-lg bg-gradient-to-br from-white via-[#A5D6A7]/5 to-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5D6A7]/10 rounded-full blur-3xl -z-0"></div>
        
        <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-bold text-[#12372A] md:text-2xl">
                Regular Payables
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600">
              Recurring monthly expenses
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => handleAddPayable()}
            className="gap-2 bg-[#2E7D32] text-white hover:bg-[#54ba59] hover:text-white dark:bg-green-900/30 dark:hover:bg-green-800/50"
          >
            <PlusIcon className="h-4 w-4" />
            Add Payable
          </Button>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <Card className="border border-gray-200 shadow-md bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-[#12372A]">
                Recent Transactions
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Latest payment and expense activities</p>
            </div>
            <div className="flex md:hidden items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A5D6A7]"></div>
                <span>Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-100"></div>
                <span>Expenses</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A5D6A7]"></div>
                <span>Payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-100"></div>
                <span>Expenses</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2 sm:space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                  <TrendingUp className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-sm">No transactions yet</p>
                <p className="text-xs text-gray-400 mt-1">Transactions will appear here once recorded</p>
              </div>
            ) : (
              recentTransactions.map((activity, index) => (
                <div
                  key={activity.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md hover:border-[#2E7D32] transition-all duration-200 gap-3 sm:gap-0"
                >
                  {/* left side - icon and description */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        activity.type === "payment"
                          ? "bg-[#A5D6A7] group-hover:bg-[#2E7D32]"
                          : "bg-red-100 group-hover:bg-red-200"
                      }`}
                    >
                      {activity.type === "payment" ? (
                        <TrendingUp
                          className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                            activity.type === "payment"
                              ? "text-[#2E7D32] group-hover:text-white"
                              : "text-red-600"
                          }`}
                        />
                      ) : (
                        <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                      )}
                    </div>

                    {/* description and date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-[#333333] line-clamp-2 sm:line-clamp-1 group-hover:text-[#12372A] transition-colors">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 h-5 border-0 hidden sm:inline-flex ${
                            activity.type === "payment"
                              ? "bg-[#A5D6A7]/20 text-[#2E7D32]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {activity.type === "payment" ? "Payment" : "Expense"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* right side - amount */}
                  <div className="flex-shrink-0 sm:ml-3 flex items-center justify-between sm:justify-end gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 h-5 border-0 inline-flex sm:hidden ${
                        activity.type === "payment"
                          ? "bg-[#A5D6A7]/20 text-[#2E7D32]"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {activity.type === "payment" ? "Payment" : "Expense"}
                    </Badge>
                    <div
                      className={`text-right font-bold text-base sm:text-lg ${
                        activity.type === "payment"
                          ? "text-[#2E7D32]"
                          : "text-red-600"
                      }`}
                    >
                      {activity.type === "payment" ? "+" : "-"}₱
                      {activity.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
