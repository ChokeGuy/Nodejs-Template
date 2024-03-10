import nodemailer from "nodemailer";
import redisConnection from "./redisConnect";

async function getOTP(email: string) {
  const redis = await redisConnection();
  const result = await redis.get(`otp:${email}`);
  return result || "No OTP code found";
}

// Define the email content
const html_content = async (email: string) => {
  const otp = await getOTP(email);
  return `<h1>Hello!</h1>
  <p>Your OTP code is: ${otp}</p>
  <p>Happy shopping in my website.</p>`;
};

async function sendEmail(email: string) {
  // Create a transporter using the Gmail SMTP server
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: "shopTN@gmail.com",
    to: email,
    subject: "OTP Verification Code",
    html: await html_content(email), // Await the html_content function to get the actual HTML string
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions); // Await the sendMail function
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

export default sendEmail;
