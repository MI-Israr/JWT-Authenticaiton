import { User } from "../models/user.js";
import bcrypt from "bcrypt";

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
  return { user, token };
};

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
