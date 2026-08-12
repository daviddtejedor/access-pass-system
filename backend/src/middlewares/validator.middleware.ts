// src/middlewares/validator.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { ErrorRes } from "../libs/TypeResponse";

export const validateSchema = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Datos de entrada inválidos";
      ErrorRes(res, 400, errorMessage);
      return;
    }

    req.body = result.data;
    next();
  };
};