import { Payment } from "@/app/admin/payments/types";

export const calculatePaymentSummary = (payments: any[]) => {
  const totalDue = payments.reduce(
    (sum, payment) => sum + Number(payment.totalAmountDue),
    0
  );
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amountPaid),
    0
  );
  const totalBalance = payments.reduce(
    (sum, payment) =>
      sum +
      Math.max(0, Number(payment.totalAmountDue) - Number(payment.amountPaid)),
    0
  );

  return { totalDue, totalPaid, totalBalance };
};
