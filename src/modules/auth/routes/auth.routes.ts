import { Router } from "express";

// import { UserRepository } from "../../users/repositories/user.repository.js";

// import { AuthController } from "../controllers/auth.controller.js";
// import { AuthService } from "../services/auth.service.js";
// import { validateRegister } from "../validators/register.validator.js";
import { UserRepository } from "../services/validators/users/user.repository.js";
import { AuthController } from "../controllers/auth,controller.js";
import { AuthService } from "../services/validators/users/respositories/routes/auth.services.js";
import { validateRegister } from "../services/validators/register.validator.js";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post("/register", validateRegister, authController.register);