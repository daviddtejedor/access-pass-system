// src/routes/auth.routes.ts
import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { AuthenticateToken } from "../middlewares/AuthenticateToken";
import { validateSchema } from "../middlewares/validator.middleware";
import { addUserSchema, loginSchema } from "../schemas/schemas";

const authR = Router();

authR.post("/register", validateSchema(addUserSchema), AuthController.register);
authR.post("/login", validateSchema(loginSchema), AuthController.login);
authR.post("/logout", AuthController.logout);
authR.get("/profile", AuthenticateToken, AuthController.profile);

export default authR;