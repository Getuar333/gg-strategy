import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service configured successfully');
  } catch (error) {
    console.error('⚠️  Email service configuration issue:', error);
  }
};

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
export default transporter;