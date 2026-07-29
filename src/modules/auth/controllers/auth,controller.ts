import type { Request, Response } from "express";

import {
  successResponse,
  type ApiSuccessResponse,
} from "../../../common/responses/api.response.js";

import type { PublicUserRecord } from "../../users/repositories/user.repository.js";
import type { RegisterDto } from "../dtos/register.dto.js";
import { AuthService } from "../services/auth.service.js";

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