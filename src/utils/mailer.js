// // utils/mailer.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// export const sendWelcomeEmail = async (toEmail, userName) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Mail content
//     const mailOptions = {
//       from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🎉 Welcome to MyApp!",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//           <h2 style="color: #4CAF50;">Hello ${userName},</h2>
//           <p>Welcome to <b>MyApp</b>! 🎉 We're excited to have you on board 🚀</p>
          
//           <p style="margin-top: 15px;">
//             Start exploring and enjoy your journey with us.  
//             If you have any questions, feel free to reply to this email anytime.
//           </p>

//           <div style="margin-top: 25px; padding: 10px; background: #f4f4f4; border-radius: 8px;">
//             <p style="margin: 0;">Cheers,</p>
//             <p style="margin: 0; font-weight: bold;">The MyApp Team</p>
//           </div>
//         </div>
//       `,
//     };

//     // Send mail
//     await transporter.sendMail(mailOptions);
//     console.log("✅ Welcome email sent to:", toEmail);
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//   }
// };


// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
