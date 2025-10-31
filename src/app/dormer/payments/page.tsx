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
import { Payment } from "@/app/admin/payments/types";
import { auth } from "@/lib/firebase";
import { getUserPayments } from "@/lib/admin/payment";

export default function PaymentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userPayments, setUserPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchUserPayments = async () => {
      if (user) {
        try {
          setLoading(true);
          const payments = await getUserPayments(user.uid);
          setUserPayments(payments);
        } catch (error) {
          console.error("Error fetching user payments:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserPayments();
  }, [user]);

  // Add loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p>Loading payments...</p>
      </div>
    );
  }

  // Return the JSX
  return (
    <div className="h-screen bg-slate-50">
      <div className=" overflow-auto">
        <div className="p-8">
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
              <p className="text-slate-600 mt-2">
                View your payabale and payment history
              </p>
            </div>
            <Card className={undefined}>
              <CardHeader className={undefined}>
                <CardTitle className={undefined}>Payment Records</CardTitle>
                <CardDescription className={undefined}>
                  All your dormitory payments and balances
                </CardDescription>
              </CardHeader>
              <CardContent className={undefined}>
                {userPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No payment records found.</p>
                  </div>
                ) : (
                  <>
                    <Table className={undefined}>
                      <TableHeader className={undefined}>
                        <TableRow className={undefined}>
                          <TableHead className={undefined}>Period</TableHead>
                          <TableHead className={undefined}>
                            Amount Due
                          </TableHead>
                          <TableHead className={undefined}>
                            Amount Paid
                          </TableHead>
                          <TableHead className={undefined}>
                            Remaining Balance
                          </TableHead>
                          <TableHead className={undefined}>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className={undefined}>
                        {userPayments.map((payment) => (
                          <TableRow key={payment.id} className={undefined}>
                            <TableCell className="font-medium">
                              {payment.billingPeriod}
                            </TableCell>
                            <TableCell className={undefined}>
                              ₱{payment.totalAmountDue}
                            </TableCell>
                            <TableCell className="text-green-600">
                              ₱{payment.amount}
                            </TableCell>
                            <TableCell
                              className={
                                payment.totalAmountDue - payment.amountPaid <= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              ₱
                              {payment.totalAmountDue - payment.amountPaid < 0
                                ? 0
                                : (
                                    payment.totalAmountDue - payment.amountPaid
                                  )}
                            </TableCell>
                            <TableCell className={undefined}>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  payment.status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Summary Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Total Due</p>
                        <p className="text-lg font-bold text-slate-900">
                          ₱
                          {userPayments
                            .reduce(
                              (sum, payment) => sum + payment.totalAmountDue,
                              0
                            )
                            }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Paid</p>
                        <p className="text-lg font-bold text-green-600">
                          ₱
                          {userPayments
                            .reduce((sum, payment) => sum + payment.amount, 0)
                            }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Balance</p>
                        <p className="text-lg font-bold text-red-600">
                          ₱
                          {userPayments
                            .reduce(
                              (sum, payment) =>
                                sum +
                                (payment.totalAmountDue - payment.amountPaid),
                              0
                            )
                            }
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
