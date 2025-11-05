"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
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
  const kpiData = [
    {
      title: "Total Amount Due",
      value: `₱${formatAmount(totalAmountDue)}`,
      description: "Total bills generated",
      icon: Wallet,
      trend: "neutral",
    },
    {
      title: "Total Amount Paid",
      value: `₱${formatAmount(totalAmountPaid)}`,
      description: "Successfully collected",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Total Remaining Balance",
      value: `₱${formatAmount(totalRemainingBalance)}`,
      description: "Outstanding balance",
      icon: TrendingDown,
      trend: "down",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <CardContent className={undefined}>
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
  );
}
