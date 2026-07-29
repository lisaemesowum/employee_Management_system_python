import { AppError } from "./app.error.js";

export class ConflictError extends AppError {
  constructor(message: string, code: string = "RESOURCE_ALREADY_EXISTS") {
    super(message, 409, code);
  }
}