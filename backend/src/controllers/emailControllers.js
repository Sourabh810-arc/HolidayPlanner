import dotenv from 'dotenv';
dotenv.config();
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_MAIL?.trim();
const smtpPass = process.env.SMTP_PASSWORD?.trim();

console.log('Email Controller - SMTP Config:');
console.log('  Host:', smtpHost);
console.log('  Port:', smtpPort);
console.log('  User:', smtpUser);
console.log('  Password exists:', !!smtpPass);
console.log('  Password length:', smtpPass?.length);
console.log('  Raw password:', JSON.stringify(process.env.SMTP_PASSWORD));

if (!smtpUser || !smtpPass) {
  console.error('ERROR: SMTP credentials are missing!');
  console.error('  SMTP_MAIL:', JSON.stringify(process.env.SMTP_MAIL));
  console.error('  SMTP_PASSWORD:', JSON.stringify(process.env.SMTP_PASSWORD));
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);

  res.status(200).json({
    success: true,
    message: "Email sent successfully",
    messageId: info.messageId,
    info,
  });
});

export { sendEmail };
