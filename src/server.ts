import type { Server } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.config.js";
import prisma  from "./config/db.config.js";

let server: Server | undefined;

const startServer = async (): Promise<void> => {
  await prisma.$connect();

  console.log("Database connection established.");

  server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });
};

const shutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received. Shutting down...`);

  if (!server) {
    await prisma.$disconnect();
    process.exit(0);
  }

  server.close(async (serverError?: Error) => {
    await prisma.$disconnect();

    if (serverError) {
      console.error("Error while shutting down the server:", serverError);

      process.exit(1);
    }

    console.log("Server shut down successfully.");

    process.exit(0);
  });
};

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

startServer().catch(async (error: unknown) => {
  console.error("Application failed to start:", error);

  await prisma.$disconnect();

  process.exit(1);
});