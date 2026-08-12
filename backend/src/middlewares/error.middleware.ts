// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../libs/AppError";
import { ErrorRes } from "../libs/TypeResponse";

export const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // 1. Error operacional/de negocio tirado explícitamente desde un servicio
    if (err instanceof AppError) {
        ErrorRes(res, err.statusCode, err.message);
        return;
    }

    // 2. Manejo de errores nativos de Mongoose (Ejemplo: Llave duplicada/Unique Index)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "campo";
        ErrorRes(res, 409, `El ${field} ya se encuentra registrado`);
        return;
    }

    // 3. Error no controlado (Crash inesperado, bug sintáctico, etc.)
    console.error("🔥 UNHANDLED ERROR:", err);
    ErrorRes(
        res,
        500,
        "Error interno del servidor",
        process.env.NODE_ENV === "development" ? err.message : undefined
    );
};