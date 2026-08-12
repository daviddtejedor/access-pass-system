// src/controllers/porton.controller.ts
import { Request, Response } from "express";
import { PortonService } from "../services/porton.service";
import { SuccessRes } from "../libs/TypeResponse";
import { catchAsync } from "../libs/catchAsync";
import { PortonCommandDTO } from "../schemas/schemas";

export default class PortonController {
  static control = catchAsync(async (req: Request, res: Response) => {
    const { command } = req.body as PortonCommandDTO;

    const message = await PortonService.sendGateCommand(command);

    SuccessRes(res, 200, message);
  });
}