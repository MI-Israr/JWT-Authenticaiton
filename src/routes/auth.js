import express from "express";
import { authUser } from "../middlewares/auth.js";

import * as authContollers from "../controllers/authControllers.js";

export const authRouter = express.Router();

authRouter.post("/signup", authContollers.signup);
authRouter.post("/login", authContollers.login);
authRouter.post("/logout", authUser, authContollers.logout);

// routes/auth.js
authRouter.post("/forgot-password", authContollers.forgotPassword);
authRouter.post("/reset-password/:token", authContollers.resetPassword);

