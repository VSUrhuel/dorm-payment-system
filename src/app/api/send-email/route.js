// File: src/app/api/send-email/route.js

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject, html, attachments } = await request.json();

    // Create a transporter object using the default SMTP transport
    // We use environment variables to keep credentials secure
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Set up email data
    const mailOptions = {
      from: `"DormPay System" <${process.env.GMAIL_USER}>`, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
      attachments: attachments || [], // Optional: Attachments if needed
    };

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
