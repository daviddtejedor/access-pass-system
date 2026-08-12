import { Router } from "express";
import PortonController from "../controllers/porton.controller";
import { AuthenticateToken } from "../middlewares/AuthenticateToken";

const portonR = Router();

portonR.post("/control", AuthenticateToken, PortonController.control);

export default portonR;