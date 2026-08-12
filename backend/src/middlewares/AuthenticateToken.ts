// src/middlewares/AuthenticateToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorRes } from "../libs/TypeResponse";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const AuthenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Obtener el token desde la Cookie 'token'
  let token = req.cookies?.token;

  // Si no está en la cookie, intentamos extraerlo del header Authorization
  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }

  // Si no vino por ninguno de los dos medios, retornamos 401
  if (!token) {
    ErrorRes(res, 401, "Token de acceso no proporcionado");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string; role?: string };

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    ErrorRes(res, 403, "Token inválido o expirado");
    return;
  }
};