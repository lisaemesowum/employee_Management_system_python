import "reflect-metadata";

import cors from "cors";
import express from "express";

import { errorMiddleware } from "./common/middleware/error.middleware.js";
import { notFoundMiddleware } from "./common/middleware/not-found.middleware.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors());

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

app.use("/api/v1", apiRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);