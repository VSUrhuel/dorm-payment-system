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

const recentActivity = [
  {
    date: "2024-01-15",
    description: "Monthly rent - John Doe (Room 101)",
    amount: "+$275.00",
    type: "payment",
  },
  {
    date: "2024-01-14",
    description: "Electricity bill payment",
    amount: "-$180.50",
    type: "expense",
  },
  {
    date: "2024-01-14",
    description: "Monthly rent - Jane Smith (Room 205)",
    amount: "+$275.00",
    type: "payment",
  },
  {
    date: "2024-01-13",
    description: "Water bill payment",
    amount: "-$95.25",
    type: "expense",
  },
  {
    date: "2024-01-13",
    description: "Monthly rent - Mike Johnson (Room 103)",
    amount: "+$275.00",
    type: "payment",
  },
];

function PayableItem({ name, amount, description }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </h3>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        ₱ {amount.toFixed(2)}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {description}
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
        return onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setter(data);
        });
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
    const totalAmountPaid = paymentsData.reduce(
      (total, payment) => total + (payment.amount || 0),
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
    console.log("Total Funds:", funds);
    console.log("Total collectibles", collectibles);
    setTotalFunds(funds);
  }, [expensesData, dormersData, billsData, paymentsData]); // Dependencies for recalculation

  useEffect(() => {
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
        date: expense.date?.toDate ? expense.date.toDate() : new Date(),
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
          console.log("Payables data fetched:", payablesData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching payables:", error);
      }
    }
    fetchPayables();
  }, []);

  const handleSavePayable = async (payableData) => {
    if (payableData.id) {
      // If it has an ID, we're updating an existing document
      const docRef = doc(db, "regularCharge", payableData.id);
      await setDoc(docRef, payableData, { merge: true }); // Use setDoc with merge to update
    } else {
      // Otherwise, we're adding a new document
      await addDoc(collection(db, "regularCharge"), payableData);
    }
  };
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
          Real-time financial status of your dormitory
        </p>
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
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50"
          >
            <PlusIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            Add Payable
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {payables.map((payable) => (
              <PayableItem key={payable.id} {...payable} />
            ))}
          </div>
        </CardContent>
      </Card>

      <AddPayableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSavePayable}
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
