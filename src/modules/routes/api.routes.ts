import { Router } from "express";

import { authRouter } from "../modules/auth/index.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);