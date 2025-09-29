import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { connectdb } from "./config/database.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", authRouter);

const PORT = process.env.PORT || 7777;

connectdb()
  .then(() => {
    console.log("✅db connected succesfully");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("⭕db connection failed", err.message);
  });
