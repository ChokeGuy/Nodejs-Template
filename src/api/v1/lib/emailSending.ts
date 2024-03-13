import nodemailer from "nodemailer";
import redisConnection from "./redisConnect";
import path from "path";
import Email from "email-templates";

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

async function getOTP(email: string, otpName: string) {
  const redis = await redisConnection();
  const result = await redis.get(`${otpName}:${email}`);
  return result || "No OTP code found";
}

// Define the email content
const html_content = async (
  email: string,
  subject: string,
  hmtl_type: string,
  otpName: string
) => {
  const otp = await getOTP(email, otpName);
  const emailTemplate = new Email({
    message: {
      from: "shopTN@gmail.com",
      to: email,
      subject: subject,
    },
    transport: transporter,
    views: {
      root: path.resolve(__dirname, "../template"),
    },
    juiceResources: {
      webResources: {
        relativeTo: path.resolve(__dirname, "../template"),
      },
    },
  });

  try {
    // Render the email template
    const html = await emailTemplate.render(hmtl_type, { email, otp });
    return html;
  } catch (error) {
    console.error("Error rendering email template: ", error);
    return "";
  }
};

async function sendEmail(
  email: string,
  subject: string,
  html_type: string,
  otpName: string
) {
  // Define the email options
  const mailOptions = {
    from: "shopTN@gmail.com",
    to: email,
    subject: subject,
    html: await html_content(email, subject, html_type, otpName), // Await the html_content function to get the actual HTML string
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions); // Await the sendMail function
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}

export default sendEmail;
