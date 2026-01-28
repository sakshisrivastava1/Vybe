import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user:process.env.EMAIL,
    pass:process.env.PASS,
  },
})


export const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      html: `<p>
          Your OTP to reset password is
          <b>${otp}</b>.<br/>
          It will expire in 5 minutes.
        </p>`,
    })

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
