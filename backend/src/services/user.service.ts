// src/services/user.service.ts
import { ModelUser } from "../models/user.model";
import * as bcrypt from "bcrypt";
import { AppError } from "../libs/AppError";
import { typePagination } from "../libs/TypeResponse";

export class UserService {

    static async getFilteredUsers(queryParams: any) {
        const { role, disabled, page: pageQuery, limit: limitQuery } = queryParams;

        const page = parseInt(pageQuery as string) || 1;
        const limit = parseInt(limitQuery as string) || 5;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (role && role !== "all")
            filter.role = role;

        if (disabled && disabled !== "all") {
            if (disabled === "active") filter.disabled = false;
            else if (disabled === "inactive") filter.disabled = true;
        }

        const [users, totalDocs] = await Promise.all([
            ModelUser.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            ModelUser.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const paginationInfo = typePagination(
            page,
            limit,
            totalDocs,
            totalPages,
            hasNextPage,
            hasPrevPage,
            hasNextPage ? page + 1 : null,
            hasPrevPage ? page - 1 : null
        );

        return { users, paginationInfo };
    }

    static async getUserById(userId: string) {
        const user = await ModelUser.findById(userId);
        if (!user)
            throw new AppError("Usuario no encontrado", 404);

        return user;
    }

    static async createUser(data: any) {
        const { dni, password, role } = data;

        const exists = await ModelUser.findOne({ dni });
        if (exists)
            throw new AppError("El DNI ya se encuentra registrado", 409);

        const passwordHash = await bcrypt.hash(password, 10);

        let expiresAt: Date | undefined;
        if (role === "PASSANT") {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 3);
            expiresAt = expirationDate;
        }

        const newUser = await ModelUser.create({ ...data, password: passwordHash, expiresAt, });

        const userToReturn = newUser.toObject();
        delete (userToReturn as any).password;

        return userToReturn;
    }

    static async updateUser(userId: string, data: any) {
        const updateData: any = { ...data };

        if (updateData.password)
            updateData.password = await bcrypt.hash(updateData.password, 10);

        const user = await ModelUser.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user)
            throw new AppError("Usuario no encontrado para actualizar", 404);

        return user;
    }

    static async softDeleteUser(userId: string) {
        const user = await ModelUser.findByIdAndUpdate(userId, { disabled: true }, { new: true });
        if (!user)
            throw new AppError("Usuario no encontrado para eliminar", 404);

        return user;
    }
}