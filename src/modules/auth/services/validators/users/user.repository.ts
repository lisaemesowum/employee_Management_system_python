import type { Prisma } from "../../../../../generated/prisma/client";
import prisma  from "../../../../../../src/common/config/db.config.js";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
}

const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  emailVerified: true,
  status: true,
  createdAt: true,

  role: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.UserSelect;

export type PublicUserRecord = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export interface ExistingUserIdentifier {
  email: string;
  phone: string | null;
}

export class UserRepository {
  async findByEmailOrPhone(
    email: string,
    phone?: string,
  ): Promise<ExistingUserIdentifier | null> {
    const conditions: Prisma.UserWhereInput[] = [
      {
        email,
      },
    ];

    if (phone) {
      conditions.push({
        phone,
      });
    }

    return prisma.user.findFirst({
      where: {
        OR: conditions,
      },
      select: {
        email: true,
        phone: true,
      },
    });
  }

  async create(input: CreateUserInput): Promise<PublicUserRecord> {
    return prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash: input.passwordHash,
        emailVerified: false,

        ...(input.phone !== undefined
          ? {
              phone: input.phone,
            }
          : {}),
      },

      select: publicUserSelect,
    });
  }
}