import { Button } from "@/components/ui/button";
export default function PaymentHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Payment Management
        </h1>
        <p className="text-sm text-gray-600">
          Track and manage all dormitory payments
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
          Export Report
        </Button>
      </div>
    </div>
  );
}
