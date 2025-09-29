import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

export const connectdb = async function () {
  await mongoose.connect(DB);
};
