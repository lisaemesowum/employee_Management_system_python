import { Transform, type TransformFnParams } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from "class-validator";

const trimText = ({ value }: TransformFnParams): unknown => {
  return typeof value === "string" ? value.trim() : value;
};

const normalizeEmail = ({ value }: TransformFnParams): unknown => {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
};

const normalizePhone = ({ value }: TransformFnParams): unknown => {
  return typeof value === "string" ? value.replace(/[\s()-]/g, "") : value;
};

export class RegisterDto {
  @Transform(trimText)
  @IsString({
    message: "First name must be a string.",
  })
  @IsNotEmpty({
    message: "First name is required.",
  })
  @Length(2, 50, {
    message: "First name must contain between 2 and 50 characters.",
  })
  firstName!: string;

  @Transform(trimText)
  @IsString({
    message: "Last name must be a string.",
  })
  @IsNotEmpty({
    message: "Last name is required.",
  })
  @Length(2, 50, {
    message: "Last name must contain between 2 and 50 characters.",
  })
  lastName!: string;

  @Transform(normalizeEmail)
  @IsNotEmpty({
    message: "Email address is required.",
  })
  @IsEmail(
    {},
    {
      message: "Please provide a valid email address.",
    },
  )
  email!: string;

  @IsOptional()
  @Transform(normalizePhone)
  @IsString({
    message: "Phone number must be a string.",
  })
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: "Please provide a valid phone number.",
  })
  phone?: string;

  @IsString({
    message: "Password must be a string.",
  })
  @IsNotEmpty({
    message: "Password is required.",
  })
  @MaxLength(72, {
    message: "Password must not exceed 72 characters.",
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must contain uppercase, lowercase, number, and special character.",
    },
  )
  password!: string;
}