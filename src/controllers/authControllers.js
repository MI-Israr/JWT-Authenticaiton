import { User } from "../models/user.js";
import { sendEmail } from "../utils/mailer.js"; // reuse your mailer
import crypto from "crypto";
import { signupValidate, loginValidate } from "../utils/validator.js";
import { loginServices, signupServices } from "../services/authServices.js";

//------------------------Registering User---------------------------------
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    signupValidate(req);
    const { user, token } = await signupServices({
      firstName,
      lastName,
      email,
      password,
    });
    res.cookie("Token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//--------------------------Login user---------------------------------
export const login = async (req, res) => {
  try {
    loginValidate(req);
    const { user, token } = await loginServices(req.body);

    res.cookie("Token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//--------------------------Logout user---------------------------------
export const logout = (req, res) => {
  res.cookie("Token", null, { expires: new Date(Date.now()) });
  res.status(200).json({ message: "User Logged Out" });
};

//-------------------------- Forgot Password ---------------------------------

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Reset link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Email message
    const message = `
      <h2>Password Reset</h2>
      <p>Click below link to reset your password (valid for 15 minutes):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Reset email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-------------------------- Forgot Password ---------------------------------

export const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Hash token to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
