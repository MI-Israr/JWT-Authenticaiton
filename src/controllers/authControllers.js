import { signupValidate, loginValidate } from "../utils/validator.js";
import {
  forgotPasswordService,
  loginServices,
  resetPasswordService,
  signupServices,
} from "../services/authServices.js";

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
    const { resetToken, resetUrl } = await forgotPasswordService(email);

    console.log("Raw reset token (send in email):", resetToken);
    console.log("Reset URL:", resetUrl);

    res.status(200).json({ message: "Reset email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-------------------------- Reset Password ---------------------------------

export const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    const response = await resetPasswordService(resetToken, password);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
