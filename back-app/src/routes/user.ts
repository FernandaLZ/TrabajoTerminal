import { Router } from "express";
import { loginUser, newUser } from "../controllers/user";

const routerUser = Router();

routerUser.post('/', newUser);
routerUser.post('/login',loginUser)

export default routerUser;