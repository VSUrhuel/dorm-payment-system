"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { formatAmount } from "../utils";
import { SummaryStats } from "../types";

export default function SummaryExpense({
  totalExpenses,
  monthlyExpenses,
  topCategory,
  expensesByCategory,
}: SummaryStats) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200">
        <CardHeader className={undefined}>
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-red-600">
            ₱{formatAmount(totalExpenses)}
          </div>
          <p className="text-xs text-gray-500 mt-1">All recorded expenses</p>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className={undefined}>
          <CardTitle className="text-sm font-medium text-gray-600">
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-orange-600">
            ₱ {formatAmount(monthlyExpenses)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Current month's expenses</p>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className={undefined}>
          <CardTitle className="text-sm font-medium text-gray-600">
            Top Category
          </CardTitle>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="text-2xl font-bold text-blue-600">{topCategory}</div>
          <p className="text-xs text-gray-500 mt-1">
            ₱ {formatAmount(expensesByCategory[topCategory] || 0)} spent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
