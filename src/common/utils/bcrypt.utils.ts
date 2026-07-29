import bcrypt from "bcrypt";

export class BcryptUtils {
  private static readonly SALT_ROUNDS = 12;

  private constructor() {}

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}