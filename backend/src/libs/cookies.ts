import { Response } from "express";

export const setAuthCookie = (res: Response, token: string): void => {
    // Calculamos la expiración (ejemplo: 7 días en milisegundos)
    const cookieExpiresInDays = 7;
    const maxAge = cookieExpiresInDays * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
        httpOnly: true, // Evita que JS del cliente (XSS) pueda leer la cookie
        secure: process.env.NODE_ENV === "production", // En prod requiere HTTPS
        sameSite: "strict", // Protege contra ataques CSRF
        maxAge: maxAge, // Tiempo de vida en ms
    });
};

export const clearAuthCookie = (res: Response): void => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};