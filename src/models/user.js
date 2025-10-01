import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: [
        (v) => {
          if (!validator.isEmail(v)) {
            throw new Error("invalid Email ID");
          }
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: [
        (v) => {
          if (!validator.isStrongPassword(v)) {
            throw new Error("Enter Strong Password");
          }
        },
      ],
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      validate: {
        validator: (value) =>
          value == null || ["male", "female", "other"].includes(value),
        message: "gender data is not valid",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/529/832/png-transparent-computer-icons-avatar-user-profile-avatar.png",
    },
    about: {
      type: String,
      default: "This is random about of user!!",
      minLength: 10,
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 4,
        message: "you are adding more then 4 skills",
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.validateUserPass = async function (userPass) {
  const user = this;
  const passwordHash = user.password;
  const validPassword = await bcrypt.compare(userPass, passwordHash);
  return validPassword;
};

// Generate Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash and set to DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // expire in 15 mins
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // return RAW token
};

export const User = mongoose.model("User", userSchema);
