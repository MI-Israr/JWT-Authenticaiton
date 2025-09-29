import { signupValidate, loginValidate } from "../utils/validator.js";
import { User } from "../models/user.js";
import { signupServices } from "../services/authServices.js";

//------------------------Registering User---------------------------------
export const signup = async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    //validating api req
    signupValidate(req);
    // Call service
    const { user, token } = await signupServices({
      firstName,
      lastName,
      emailId,
      password,
    });
    //Add token to cookies and response back to user
    res.cookie("Token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.status(201).json({ user });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//--------------------------Login user---------------------------------
export const login = async (req, res) => {
  try {
    loginValidate(req);
    const { user, token } = await loginService(req.body);

    res.cookie("Token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//--------------------------Logout user---------------------------------
export const logout = (req, res) => {
  res.cookie("Token", null, { expires: new Date(Date.now()) });
  res.send("User Logged Out");
};
