export const newBillTemplate = (
  firstName: string,
  billingPeriod: string,
  totalAmountDue: number
) => `
  <h1>New Bill Generated</h1>
  <p>Hi ${firstName},</p>
  <p>A new bill for the period <strong>${billingPeriod}</strong> has been generated.</p>
  <p>Amount Due: <strong>₱${totalAmountDue.toFixed(2)}</strong></p>
  <p>Please pay this amount to the Dorm SA.</p>

   <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
    <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
      <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;
