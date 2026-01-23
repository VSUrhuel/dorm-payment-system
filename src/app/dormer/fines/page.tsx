"use client";

import React from "react";

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
import { LayoutGrid, CreditCard, LogOut, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { Payment } from "@/app/admin/payments/types";
import { auth } from "@/lib/firebase";
import { getUserPayments } from "@/lib/admin/payment";
import { formatAmount } from "@/app/admin/expenses/utils";
import { getBills } from "@/lib/admin/bill";
import { useCurrentDormitoryId } from "@/hooks/useCurrentDormitoryId";
import { getFinesPayment } from "@/lib/admin/fines";
import { PaymentFines } from "@/app/admin/fines/types";
import { calculateFinePaymentSummary } from "./utils/payment-summary";
import { formatDate } from "@/app/admin/fines/formatDate";

export default function FinesUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userFinesPayments, setUserFinesPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRemarks, setExpandedRemarks] = useState<Record<string, boolean>>({});
  const { dormitoryId, loading: dormitoryLoading } = useCurrentDormitoryId();

  const toggleRemarks = (id: string) => {
    setExpandedRemarks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
    const fetchUserFinesPayments = async () => {
      if (user) {
        try {
          setLoading(true);
          
          const payments = await getFinesPayment(user.uid, dormitoryId);
          setUserFinesPayments(payments);
        } catch (error) {
          console.error("Error fetching user payments:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserFinesPayments();
  }, [user, dormitoryId]);

  // Add loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-2">
            <div className="h-8 sm:h-10 w-40 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 sm:h-5 w-48 sm:w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-80 sm:h-96 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Return the JSX
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#12372A] tracking-tight">
            My Fines
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#12372A] mt-1 sm:mt-1.5">
            View your fine payable and payment history
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-md bg-white gap-0">
        <CardHeader className="border-b border-gray-100 md:pb-0">
          <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-[#12372A]">
            Fine Records
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1">
            All your dormitory fine payable and balances
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {userFinesPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-3 sm:px-4">
              <div className="relative mb-4 sm:mb-6 inline-block">
                <div className="absolute inset-0 bg-gray-100/50 rounded-full blur-2xl"></div>
                <div className="relative p-4 sm:p-6 rounded-full bg-[#E0E0E0]">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#333333] mb-2">
                No Fine Payment Records Found
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center max-w-md px-4">
                You don't have any fine payment records yet. They will appear here once fines are generated.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 md:p-6">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table className="">
                  <TableHeader className="">
                    <TableRow className="bg-[#f0f0f0] hover:bg-[#f0f0f0]">
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm">
                        Date Generated
                      </TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm">
                        Amount Due
                      </TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm">
                        Amount Paid
                      </TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm">
                        Balance
                      </TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm hidden md:table-cell">
                        Recorded At
                      </TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm max-w-[20ch] w-[20ch]">Remarks</TableHead>
                      <TableHead className="font-bold text-[#12372A] text-xs sm:text-sm">Status</TableHead>
                      
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {userFinesPayments.map((finePayment: PaymentFines) => {
                      const remainingBalance = finePayment.remainingBalance;
                      const isFullyPaid = remainingBalance === 0;
                      const isExpanded = expandedRemarks[finePayment.id] || false;
                      const shouldTruncate = finePayment.finesRemarks && finePayment.finesRemarks.length > 20;

                      return (
                        <React.Fragment key={finePayment.id}>
                        <TableRow className="hover:bg-[#f0f0f0] transition-colors">
                          <TableCell className="font-semibold text-[#333333] text-xs sm:text-sm w-[150px]">
                            <span className="truncate block" title={finePayment.createdAt.toDate().toLocaleDateString()}>
                              {formatDate(finePayment.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-[#333333] text-xs sm:text-sm w-[120px]">
                            ₱{formatAmount(finePayment.totalAmountDue)}
                          </TableCell>
                          <TableCell className="text-[#2E7D32] font-semibold text-xs sm:text-sm w-[120px]">
                            ₱{formatAmount(finePayment.amountPaid)}
                          </TableCell>
                         
                          <TableCell
                            className={`font-semibold text-xs sm:text-sm w-[120px] ${
                              isFullyPaid
                                ? "text-[#2E7D32]"
                                : "text-red-600"
                            }`}
                          >
                            ₱{formatAmount(remainingBalance)}
                          </TableCell>
                          <TableCell className="text-gray-600 text-xs sm:text-sm hidden md:table-cell w-[180px]">
                            {finePayment.paymentDate ? <span className="truncate block" title={finePayment.status == "Unpaid" ? "N/A" : finePayment.paymentDate.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}>
                              {finePayment.status == "Unpaid"
                                ? "N/A"
                                : finePayment.paymentDate
                                    .toDate()
                                    .toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                            </span> : "N/A"}
                          </TableCell>
                           <TableCell className="text-[#2E7D32] flex items-start max-w-[20ch] font-semibold text-xs sm:text-sm ">
                            <div className={`flex-1 ${shouldTruncate ? 'line-clamp-2 max-w-[20ch]' : ''} break-words pr-2`}>
                              {finePayment.finesRemarks}
                            </div>
                            {shouldTruncate && (
                               <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRemarks(finePayment.id)}
                                  className="h-6 w-6 p-0 flex-shrink-0"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                            )}
                          </TableCell>
                          <TableCell className="w-[140px]">
                            <span
                              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block whitespace-nowrap ${
                                finePayment.status === "Paid"
                                  ? "bg-[#A5D6A7] text-[#2E7D32]"
                                  : finePayment.status === "Partially Paid"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {finePayment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                        {isExpanded && finePayment.finesRemarks && finePayment.finesRemarks.length > 20 && (
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableCell colSpan={7} className="p-0 border-t-0">
                                <div className="p-3 pl-[200px] bg-gray-50 border-t border-gray-200">
                                <div className="font-medium text-sm text-gray-600 mb-1">
                                    Full Remarks:
                                </div>
                                <div className="text-gray-800 whitespace-pre-wrap break-words bg-white p-3 rounded border border-gray-200">
                                    {finePayment.finesRemarks}
                                </div>
                                </div>
                            </TableCell>
                            </TableRow>
                        )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                      Total Amount Due
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#333333]">
                      ₱
                      {formatAmount(
                        calculateFinePaymentSummary(userFinesPayments).totalAmountDue
                      )}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#A5D6A7]/10 to-white p-4 rounded-xl border border-[#A5D6A7]/30">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                      Total Amount Paid
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#2E7D32]">
                      ₱
                      {formatAmount(
                        calculateFinePaymentSummary(userFinesPayments).totalAmountPaid
                      )}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br p-4 rounded-xl border ${
                    calculateFinePaymentSummary(userFinesPayments).totalBalance === 0
                      ? "from-[#A5D6A7]/10 to-white border-[#A5D6A7]/30"
                      : "from-red-50 to-white border-red-200"
                  }`}>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
                      Outstanding Balance
                    </p>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${
                        calculateFinePaymentSummary(userFinesPayments)
                          .totalBalance === 0
                          ? "text-[#2E7D32]"
                          : "text-red-600"
                      }`}
                    >
                      ₱
                      {formatAmount(
                        calculateFinePaymentSummary(userFinesPayments).totalBalance
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
                    <span>Payment Progress</span>
                    <span className="text-[#2E7D32] font-semibold">
                      {Math.round(
                        (calculateFinePaymentSummary(userFinesPayments).totalAmountPaid /
                          calculateFinePaymentSummary(userFinesPayments)
                            .totalAmountDue) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-[#2E7D32] to-[#A5D6A7] h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{
                        width: `${Math.min(
                          100,
                          (calculateFinePaymentSummary(userFinesPayments)
                            .totalAmountPaid /
                            calculateFinePaymentSummary(userFinesPayments)
                              .totalAmountDue) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
