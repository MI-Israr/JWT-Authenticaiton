import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";

//-------------------------- Signup ---------------------------------
export const signupServices = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: passwordHash,
  });

  await user.save();
  const token = await user.getJWT();
  // Send welcome email
  await sendWelcomeEmail(email, firstName);
  return { user, token };
};

//-------------------------- Login ---------------------------------
export const loginServices = async ({ email, password }) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("invalid credentials");
  }
  const validPassword = await user.validateUserPass(password);
  if (!validPassword) {
    throw new Error("invalid credentials");
  }
  const token = await user.getJWT();

  return { user, token };
};

//-------------------------- Forgot Password ---------------------------------
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  const message = `
      <h2>Password Reset</h2>
      <p>Click below link to reset your password (valid for 15 minutes):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

  await sendEmail(user.email, "Password Reset Request", message);

  return { resetToken, resetUrl };
};

//-------------------------- Reset Password ---------------------------------
export const resetPasswordService = async (req, res) => {
  // Hash token to compare with DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // token not expired
  });

  if (!user) throw new Error("Invalid or expired token");

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  return { message: "Password reset successful!" };
};
