export const welcomeUserTemplate = (firstName: string) => `
  <h1>Welcome, ${firstName}!</h1>
  <p>Your dormer account has been created successfully. This is where you will receive your bills and payment confirmations!</p>
  <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
  <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
      <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;
