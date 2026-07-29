// ---------- this makes the route not to be exposed 
import { validateBody } from "../../../common/middleware/validate.middleware.js";
import { RegisterDto } from "../dtos/register.dto.js";

export const validateRegister = validateBody(RegisterDto);