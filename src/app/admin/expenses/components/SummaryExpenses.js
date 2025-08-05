"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryExpense({
  totalExpenses,
  monthlyExpenses,
  topCategory,
  expensesByCategory,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ₱
            {totalExpenses
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <p className="text-xs text-gray-500 mt-1">All recorded expenses</p>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            ₱
            {monthlyExpenses
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <p className="text-xs text-gray-500 mt-1">Current month expenses</p>
        </CardContent>
      </Card>
      <Card className="border-gray-200">
        <CardHeader className="">
          <CardTitle className="text-sm font-medium text-gray-600">
            Top Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{topCategory}</div>
          <p className="text-xs text-gray-500 mt-1">
            ₱
            {(expensesByCategory[topCategory] || 0)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
