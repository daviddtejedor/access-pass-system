// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { SuccessRes } from "../libs/TypeResponse";
import { catchAsync } from "../libs/catchAsync";
import { AddUserDTO, UpdateUserDTO } from "../schemas/schemas";

export default class UserController {

  static getFilterUsers = catchAsync(async (req: Request, res: Response) => {
    const { users, paginationInfo } = await UserService.getFilteredUsers(req.query);

    const message = users.length === 0
      ? "No se encontraron usuarios con los filtros aplicados"
      : "Usuarios filtrados exitosamente";

    SuccessRes(res, 200, message, "user", users, paginationInfo);
  });

  static getSpecificUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params._id);
    SuccessRes(res, 200, "Usuario encontrado", "user", user);
  });

  static addUser = catchAsync(async (req: Request, res: Response) => {
    const body = req.body as AddUserDTO;
    const newUser = await UserService.createUser(body);
    SuccessRes(res, 201, "Usuario agregado exitosamente", "user", newUser);
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const body = req.body as UpdateUserDTO;
    const updatedUser = await UserService.updateUser(req.params._id, body);
    SuccessRes(res, 200, "Usuario actualizado exitosamente", "user", updatedUser);
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const deletedUser = await UserService.softDeleteUser(req.params._id);
    SuccessRes(res, 200, "Usuario eliminado exitosamente", "user", deletedUser);
  });
}