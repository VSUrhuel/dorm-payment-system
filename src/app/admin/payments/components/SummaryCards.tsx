"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { formatAmount } from "../utils/formatAmount";

interface SummaryCardsProps {
  totalAmountDue: number;
  totalAmountPaid: number;
  totalRemainingBalance: number;
}

export default function SummaryCards({
  totalAmountDue,
  totalAmountPaid,
  totalRemainingBalance,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Amount Due
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-gray-900">
            ₱{formatAmount(totalAmountDue)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Amount Paid
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-green-600">
            ₱{formatAmount(totalAmountPaid)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Remaining Balance
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-red-600">
            ₱{formatAmount(totalRemainingBalance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
