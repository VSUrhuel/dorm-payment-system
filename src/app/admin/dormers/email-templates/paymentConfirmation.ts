export const paymentConfirmationTemplate = (
  firstName: string,
  amount: number,
  billId: string
) => `
  <h1>Payment Received!</h1>
  <p>Hi ${firstName},</p>
  <p>We've received your payment of <strong>₱${amount.toFixed(
    2
  )}</strong> for bill ${billId}.</p>
  <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
    <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
      <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;
