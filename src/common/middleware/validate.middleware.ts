import { plainToInstance, type ClassConstructor } from "class-transformer";
import {
  validate,
  type ValidationError as ClassValidationError,
} from "class-validator";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import {
  RequestValidationError,
  type ValidationIssueMap,
} from "../errors/request-validation.error.js";

const flattenValidationErrors = (
  errors: ClassValidationError[],
  parentProperty = "",
): ValidationIssueMap => {
  const issues: ValidationIssueMap = {};

  for (const error of errors) {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    if (error.constraints) {
      issues[propertyPath] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      Object.assign(
        issues,
        flattenValidationErrors(error.children, propertyPath),
      );
    }
  }

  return issues;
};

export const validateBody = <T extends object>(
  dtoClass: ClassConstructor<T>,
): RequestHandler => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);

      const validationErrors = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: false,
        validationError: {
          target: false,
          value: false,
        },
      });

      if (validationErrors.length > 0) {
        const issues = flattenValidationErrors(validationErrors);

        throw new RequestValidationError(issues);
      }

      req.body = dtoInstance;

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};