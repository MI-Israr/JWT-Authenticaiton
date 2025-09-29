import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const signupServices = async ({
  firstName,
  lastName,
  emailId,
  password,
}) => {
  //pass hashing
  const passwordHash = await bcrypt.hash(password, 10);
  //creating new instance
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  // saving to db
  await user.save();
  const token = await user.getJWT();
  //Add token to cookies and response back to user
  return { user, token };
};

export const loginServices = async ({ emailId, password }) => {
  const user = await User.findOne({ emailId: emailId });
  if (!user) {
    throw new Error("invalid credentials");
  }
  const validPassword = await user.validateUserPass(password);
  if (!validPassword) {
    throw new Error("invalid credentials");
  }
  if (validPassword) {
    ///Create JWT token
    const token = await user.getJWT();
  }
  return { user, token };
};
