"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutGrid, CreditCard, LogOut } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { dashboardData, recentBills } from "@/lib/user/dashboard";
import { Bill } from "../admin/dormers/types";
import { formatAmount } from "../admin/expenses/utils";

const userPayments = [
  {
    id: 1,
    period: "2025-08",
    amountDue: 250,
    amountPaid: 250,
    balance: 0,
    status: "Paid",
    dueDate: "2025-08-15",
  },
  {
    id: 2,
    period: "2025-09",
    amountDue: 250,
    amountPaid: 0,
    balance: 250,
    status: "Pending",
    dueDate: "2025-09-15",
  },
  {
    id: 3,
    period: "2025-10",
    amountDue: 250,
    amountPaid: 0,
    balance: 250,
    status: "Pending",
    dueDate: "2025-10-15",
  },
];

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [totalDue, setTotalDue] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [bills, setBills] = useState<Bill[]>([]);

  // Handle authentication first
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User) => {
      if (!currentUser) {
        // If no user is found, redirect to the login page
        window.location.href = "/";
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Then fetch data only when user is available
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!user) return; // Don't fetch if no user

      try {
        const data = await dashboardData();
        if (!mounted) return;

        setTotalDue(data.totalDue);
        setTotalPayments(data.totalPayments);
        setTotalExpenses(data.totalExpenses);
        setRemainingBalance(data.remainingBalance);
        setTotalBills(data.totalBills);

        // Only fetch bills if user exists
        const userBills = await recentBills(user.uid);
        if (!mounted) return;
        setBills(userBills);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [user]); // This effect depends on user

  console.log("Bills:", bills);
  return (
    <div className="h-screen bg-slate-50">
      <div className=" overflow-auto">
        <div className="p-8">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-2">
                View dormitory funds summary
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 md:gap-6 md:mb-8 grid-cols-1 gap-2 mb-2">
              <Card className={undefined}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Amount Due
                  </CardTitle>
                </CardHeader>
                <CardContent className={undefined}>
                  <p className="text-3xl font-bold text-slate-900">
                    ₱{formatAmount(totalDue)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Amount to be Paid by Dormers
                  </p>
                </CardContent>
              </Card>
              <Card className={undefined}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Amount Paid
                  </CardTitle>
                </CardHeader>
                <CardContent className={undefined}>
                  <p className="text-3xl font-bold text-green-600">
                    ₱{formatAmount(totalPayments)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Overall Payments
                  </p>
                </CardContent>
              </Card>
              <Card className={undefined}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Dorm Fund Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className={undefined}>
                  <p className="text-3xl font-bold text-red-600">
                    ₱{formatAmount(remainingBalance)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Available Money</p>
                </CardContent>
              </Card>
              <Card className={undefined}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Dorm Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className={undefined}>
                  <p className="text-3xl font-bold text-green-600">
                    ₱{formatAmount(totalExpenses)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Overall Expenses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card className={undefined}>
              <CardHeader className={undefined}>
                <CardTitle className={undefined}>Payment Overview</CardTitle>
                <CardDescription className={undefined}>
                  Your recent payment history
                </CardDescription>
              </CardHeader>
              <CardContent className={undefined}>
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          Period {bill.billingPeriod}
                        </p>
                        <p className="text-sm text-slate-500">
                          Amount: {bill.totalAmountDue}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          ₱{bill.amountPaid}
                        </p>
                        <span
                          className={`text-sm px-2 py-1 rounded inline-block mt-1 ${
                            bill.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
