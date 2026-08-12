// src/services/auth.service.ts
import { ModelUser } from "../models/user.model";
import * as bcrypt from "bcrypt";
import { generateToken } from "../libs/jwt";
import { AppError } from "../libs/AppError";

export class AuthService {
    static async register(data: any): Promise<{ user: any; token: string }> {
        const { dni, name, email = [], password, role, schedule } = data;

        // 1. Regla de negocio: Verificar si el DNI ya existe
        const userExists = await ModelUser.findOne({ dni });
        if (userExists)
            throw new AppError("El DNI ya se encuentra registrado", 409);

        // 2. Hash de contraseña y creación
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await ModelUser.create({
            dni,
            name,
            email,
            password: passwordHash,
            role,
            schedule: schedule || [],
        });

        // 3. Generación de Token
        const token = (await generateToken({ id: newUser._id.toString() })) as string;
        const userObj = newUser.toObject();
        delete (userObj as any).password;

        return { user: userObj, token };
    }

    static async login(data: any): Promise<{ user: any; token: string }> {
        const { dni, password } = data;

        //  .select("+password") trae el hash de la DB aunque tenga 'select: false' en el Schema
        const userFound = await ModelUser.findOne({ dni }).select("+password");
        if (!userFound)
            throw new AppError("Credenciales inválidas", 401);

        // Validación de seguridad por si 'password' viene undefined por payload
        if (!password || !userFound.password)
            throw new AppError("Credenciales inválidas", 401);


        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch)
            throw new AppError("Credenciales inválidas", 401);

        const token = (await generateToken({ id: userFound._id.toString() })) as string;
        const userObj = userFound.toObject();
        delete (userObj as any).password;

        return { user: userObj, token };
    }

    static async getUserProfile(userId?: string) {
        if (!userId)
            throw new AppError("Usuario no autenticado", 401);

        const userFound = await ModelUser.findById(userId).select("-password");
        if (!userFound)
            throw new AppError("Usuario no encontrado", 404);

        return userFound;
    }
}