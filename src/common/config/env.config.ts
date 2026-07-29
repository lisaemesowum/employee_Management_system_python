import "dotenv/config";

type NodeEnvironment = "development" | "test" | "production";

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getNodeEnvironment = (): NodeEnvironment => {
  const value = process.env.NODE_ENV ?? "development";

  if (value !== "development" && value !== "test" && value !== "production") {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  return value;
};

const getPort = (): number => {
  const port = Number(process.env.PORT ?? 4000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number.");
  }

  return port;
};

export const env = Object.freeze({
  NODE_ENV: getNodeEnvironment(),
  PORT: getPort(),
  DATABASE_URL: getRequiredEnvironmentVariable("DATABASE_URL"),
});