"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const routerUser = (0, express_1.Router)();
routerUser.post('/', user_1.newUser);
routerUser.post('/login', user_1.loginUser);
exports.default = routerUser;
