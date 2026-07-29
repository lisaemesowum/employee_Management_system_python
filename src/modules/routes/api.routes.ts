import { Router } from "express";

// import { authRouter } from "../modules/auth/index.js";
import { authRouter } from "../auth/routes/auth.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);