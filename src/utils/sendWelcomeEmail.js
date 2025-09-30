// utils/mailer.js (same file or another)
import { sendEmail } from "./mailer.js";

export const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${userName},</h2>
        <p>Welcome to <b>MyApp</b>! 🎉 We're excited to have you on board 🚀</p>
        
        <p style="margin-top: 15px;">
          Start exploring and enjoy your journey with us.  
          If you have any questions, feel free to reply to this email anytime.
        </p>

        <div style="margin-top: 25px; padding: 10px; background: #f4f4f4; border-radius: 8px;">
          <p style="margin: 0;">Cheers,</p>
          <p style="margin: 0; font-weight: bold;">The MyApp Team</p>
        </div>
      </div>
    `;

    await sendEmail(toEmail, "🎉 Welcome to MyApp!", html);
    console.log("✅ Welcome email sent to:", toEmail);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
  }
};
