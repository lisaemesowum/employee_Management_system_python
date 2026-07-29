import { ConflictError } from "../../../../../../../common/errors/conflict.error";
import { BcryptUtils } from "../../../../../../../common/utils/bcrypt.utils.js";

import {
  type CreateUserInput,
  type PublicUserRecord,
  UserRepository,
} from "../../users/repositories/user.repository.js";

import type { RegisterDto } from "../../../../../../auth/dtos/register.dto.js";

interface PrismaErrorLike {
  code?: unknown;
  meta?: {
    target?: unknown;
  };
}

const isPrismaUniqueConstraintError = (
  error: unknown,
): error is PrismaErrorLike & { code: "P2002" } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as PrismaErrorLike).code === "P2002"
  );
};

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<PublicUserRecord> {
    const email = registerDto.email.trim().toLowerCase();

    const phone = registerDto.phone?.trim();

    const existingUser = await this.userRepository.findByEmailOrPhone(
      email,
      phone,
    );

    if (existingUser?.email === email) {
      throw new ConflictError(
        "An account with this email address already exists.",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    if (phone !== undefined && existingUser?.phone === phone) {
      throw new ConflictError(
        "An account with this phone number already exists.",
        "PHONE_ALREADY_EXISTS",
      );
    }

    const passwordHash = await BcryptUtils.hash(registerDto.password);

    const userData: CreateUserInput = {
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      email,
      passwordHash,

      ...(phone !== undefined
        ? {
            phone,
          }
        : {}),
    };

    try {
      return await this.userRepository.create(userData);
    } catch (error: unknown) {
      /*
       * The earlier duplicate check improves the user experience,
       * but another request could create the same record between
       * the check and the INSERT operation.
       *
       * Therefore, we must still handle the database unique
       * constraint error.
       */
      if (isPrismaUniqueConstraintError(error)) {
        const target = JSON.stringify(error.meta?.target ?? "").toLowerCase();

        if (target.includes("phone")) {
          throw new ConflictError(
            "An account with this phone number already exists.",
            "PHONE_ALREADY_EXISTS",
          );
        }

        throw new ConflictError(
          "An account with this email address already exists.",
          "EMAIL_ALREADY_EXISTS",
        );
      }

      throw error;
    }
  }
}