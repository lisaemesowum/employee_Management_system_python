import type { Request, Response } from "express";

import {
  successResponse,
  type ApiSuccessResponse,
} from "../../../common/response/api.response";
// import type { PublicUserRecord } from "../../../modules/auth/services/validators/users/user.repository";
import type { PublicUserRecord } from "../services/validators/users/user.repository";
import type { RegisterDto } from "../dtos/register.dto.js";
import { AuthService } from "../services/validators/users/respositories/routes/auth.services";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  readonly register = async (
    req: Request<
      Record<string, never>,
      ApiSuccessResponse<PublicUserRecord>,
      RegisterDto
    >,
    res: Response<ApiSuccessResponse<PublicUserRecord>>,
  ): Promise<void> => {
    const user = await this.authService.register(req.body);

    res
      .status(201)
      .json(successResponse("User account created successfully.", user));
  };
}