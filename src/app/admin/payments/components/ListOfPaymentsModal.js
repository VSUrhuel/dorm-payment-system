"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PaymentDetailsModal({ isOpen, onClose, bill }) {
  if (!isOpen || !bill) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* This makes the modal content vertically scrollable if the list is too long,
        which is a good practice for mobile responsiveness.
      */}
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            A detailed breakdown of payments for bill{" "}
            <span className="font-mono">{bill.billingPeriod}</span> for{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {bill.dormer?.firstName} {bill.dormer?.lastName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* FIX: This container makes the table horizontally scrollable on small screens
          without affecting the dialog header.
        */}
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.payments && bill.payments.length > 0 ? (
                bill.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      ₱{payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      {/* Added optional chaining to prevent errors if user is missing */}
                      {payment.recordedByUser?.firstName ?? "N/A"}{" "}
                      {payment.recordedByUser?.lastName ?? ""}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="4"
                    className="text-center h-24 text-gray-500"
                  >
                    No payments have been recorded for this bill yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
