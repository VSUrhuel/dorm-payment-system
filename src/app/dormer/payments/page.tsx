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
import { LayoutGrid, CreditCard, LogOut, FileText } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { Payment } from "@/app/admin/payments/types";
import { auth } from "@/lib/firebase";
import { getUserPayments } from "@/lib/admin/payment";
import { formatAmount } from "@/app/admin/expenses/utils";
import { calculatePaymentSummary } from "./utils/paymentSummary";
import { getBills } from "@/lib/admin/bill";

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
          const payments = await getBills(user.uid);
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
                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-slate-500">
                      No payment records found.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table className={undefined}>
                        <TableHeader className={undefined}>
                          <TableRow className={undefined}>
                            <TableHead className={undefined}>
                              Billing Period
                            </TableHead>
                            <TableHead className={undefined}>
                              Amount Due
                            </TableHead>
                            <TableHead className={undefined}>
                              Amount Paid
                            </TableHead>
                            <TableHead className={undefined}>
                              Remaining Balance
                            </TableHead>
                            <TableHead className={undefined}>
                              Recorded At
                            </TableHead>

                            <TableHead className={undefined}>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className={undefined}>
                          {userPayments.map((payment) => {
                            const remainingBalance = Math.max(
                              0,
                              Number(payment.totalAmountDue) -
                                Number(payment.amountPaid)
                            );
                            const isFullyPaid = remainingBalance === 0;

                            return (
                              <TableRow key={payment.id} className={undefined}>
                                <TableCell className="font-medium">
                                  {payment.billingPeriod}
                                </TableCell>
                                <TableCell className={undefined}>
                                  ₱{formatAmount(payment.totalAmountDue)}
                                </TableCell>
                                <TableCell className="text-green-600">
                                  ₱{formatAmount(payment.amountPaid)}
                                </TableCell>
                                <TableCell
                                  className={
                                    isFullyPaid
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  ₱{formatAmount(remainingBalance)}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                  {payment.status == "Unpaid"
                                    ? "N/A"
                                    : payment.updatedAt
                                        .toDate()
                                        .toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                </TableCell>
                                <TableCell className={undefined}>
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      payment.status === "Paid"
                                        ? "bg-green-100 text-green-800"
                                        : payment.status === "Partially Paid"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center md:text-left">
                          <p className="text-sm text-slate-600 mb-1">
                            Total Amount Due
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            ₱
                            {formatAmount(
                              calculatePaymentSummary(userPayments).totalDue
                            )}
                          </p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-sm text-slate-600 mb-1">
                            Total Amount Paid
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ₱
                            {formatAmount(
                              calculatePaymentSummary(userPayments).totalPaid
                            )}
                          </p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-sm text-slate-600 mb-1">
                            Outstanding Balance
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              calculatePaymentSummary(userPayments)
                                .totalBalance === 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ₱
                            {formatAmount(
                              calculatePaymentSummary(userPayments).totalBalance
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Payment Progress</span>
                          <span>
                            {Math.round(
                              (calculatePaymentSummary(userPayments).totalPaid /
                                calculatePaymentSummary(userPayments)
                                  .totalDue) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (calculatePaymentSummary(userPayments)
                                  .totalPaid /
                                  calculatePaymentSummary(userPayments)
                                    .totalDue) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
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
