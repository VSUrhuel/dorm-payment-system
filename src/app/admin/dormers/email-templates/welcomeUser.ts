export const welcomeUserTemplate = (
  firstName: string,
  email: string,
  temporaryPassword: string
) => `
  <h1>Welcome, ${firstName}!</h1>
  <p>Your dormer account has been created successfully.</p>
  <p>Email: <strong>${email}</strong></p>
  <p>Password: <strong>${temporaryPassword}</strong></p>
  <p style="margin-top: 25px;">Please <a href="https://dorm-payment-system.vercel.app/" style="color: #007bff; text-decoration: none;">log in</a> and change your password as soon as possible for security reasons.</p>
  <p>This is where you will receive your bills and payment confirmations!</p>
  <p style="margin-top: 25px;">Best regards,<br><strong>Mabolo Management</strong></p>
  <div style="border-top: 1px solid #eeeeee; margin-top: 30px; padding-top: 20px; color: #888888; text-align: center; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Mabolo Men's Home. All rights reserved.</p>
      <p style="margin: 5px 0 0 0;">Visca, Baybay City, Leyte</p>
      <p style="margin: 5px 0 0 0;">This is an automated message, please do not reply.</p>
  </div>
`;
