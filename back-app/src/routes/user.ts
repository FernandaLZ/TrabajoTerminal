import { Router } from "express";
import { createOrUpdatePaciente, getFichaMedica, listPacientes, loginUser, newUser } from "../controllers/user";

const routerUser = Router();

routerUser.post('/', newUser);
routerUser.post('/login',loginUser)
routerUser.post('/list',listPacientes)
routerUser.post('/paciente',createOrUpdatePaciente)
routerUser.get('/pacientes/:uid',getFichaMedica)

export default routerUser;