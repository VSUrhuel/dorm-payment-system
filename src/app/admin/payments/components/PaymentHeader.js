import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
export default function PaymentHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Payment Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and track all bills and payments for the dormitory
        </p>
      </div>
    </div>
  );
}
