import { Router } from "express";
import UserController from "../controllers/user.controller";
import { AuthenticateToken } from "../middlewares/AuthenticateToken";
import { validateSchema } from "../middlewares/validator.middleware";
import { addUserSchema } from "../schemas/schemas";

const userR = Router();

// userR.get("/", AuthenticateToken, UserController.getUsers); // YA NO SE USA
userR.get("/filter", AuthenticateToken, UserController.getFilterUsers);
userR.get("/:_id", AuthenticateToken, UserController.getSpecificUser);
userR.post("/", validateSchema(addUserSchema), AuthenticateToken, UserController.addUser);
userR.put("/:_id", validateSchema(addUserSchema.partial()), AuthenticateToken, UserController.updateUser);
userR.delete("/:_id", AuthenticateToken, UserController.deleteUser);

export default userR;