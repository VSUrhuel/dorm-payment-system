import React from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  LucideProps,
} from "lucide-react";
import { Bill } from "../types";

type StatusType = Bill["status"];

interface BadgeInfo {
  className: string;
  Icon: React.ComponentType<LucideProps> | null;
}

export const getStatusBadgeInfo = (status: StatusType): BadgeInfo => {
  switch (status) {
    case "Paid":
      return {
        className: "bg-green-100 text-green-800",
        Icon: CheckCircle,
      };
    case "Unpaid":
      return {
        className: "bg-yellow-100 text-yellow-800",
        Icon: Clock,
      };
    case "Partially Paid":
      return {
        className: "bg-blue-100 text-blue-800",
        Icon: DollarSign,
      };
    case "Overdue":
      return {
        className: "bg-red-100 text-red-800",
        Icon: AlertCircle,
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800",
        Icon: null,
      };
  }
};
