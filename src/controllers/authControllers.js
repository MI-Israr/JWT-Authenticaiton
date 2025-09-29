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
