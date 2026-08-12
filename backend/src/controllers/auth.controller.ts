import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SuccessRes, ErrorRes } from "../libs/TypeResponse";
import { catchAsync } from "../libs/catchAsync";
import { AddUserDTO, LoginDTO } from "../schemas/schemas";
import { AuthenticatedRequest } from "@middlewares/AuthenticateToken";

const isProduction = process.env.NODE_ENV === "production";

export default class AuthController {

  static register = catchAsync(async (req: Request, res: Response) => {
    const { user, token } = await AuthService.register(req.body as AddUserDTO);

    // Seteamos la cookie para que quede autenticado tras registrarse
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    SuccessRes(res, 201, "Registro exitoso", "user", { user, token });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    // 1. Recuperamos tanto 'user' como 'token' desde AuthService
    const { user, token } = await AuthService.login(req.body as LoginDTO);

    // 2. Seteamos la cookie 'token' en la respuesta HTTP
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    // 3. Retornamos user y token para que el frontend pueda usarlos
    SuccessRes(res, 200, "Login exitoso", "user", user);
  });

  static logout = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    SuccessRes(res, 200, "Logout exitoso");
  });

  static profile = catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthenticatedRequest;

    if (!user?.id) {
      return ErrorRes(res, 401, "Usuario no autenticado");
    }

    const userProfile = await AuthService.getUserProfile(user.id);
    SuccessRes(res, 200, "Perfil obtenido exitosamente", "user", userProfile);
  });
}