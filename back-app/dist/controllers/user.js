"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.newUser = void 0;
const conection_1 = require("../db/conection");
const errorMapping_1 = require("../utils/errorMapping");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, password } = req.body;
    try {
        const userRecord = yield conection_1.admin.auth().createUser({
            email: nombre,
            emailVerified: false,
            password: password,
            disabled: false,
        });
        console.log('Successfully created new user:', userRecord.uid);
        res.status(200).json({
            msg: "User created successfully",
            uid: userRecord.uid
        });
    }
    catch (error) {
        console.error('Error creating new user:', error);
        const mappedError = (0, errorMapping_1.mapFirebaseError)(error);
        if (mappedError.code == 'auth/email-already-in-use') {
            res.status(400).json({
                msg: mappedError.message
            });
        }
        else if ('auth/invalid-email') {
            res.status(400).json({
                msg: mappedError.message
            });
        }
        else if ('auth/operation-not-allowed') {
            res.status(500).json({
                msg: mappedError.message
            });
        }
        else if ('auth/weak-password') {
            res.status(400).json({
                msg: mappedError.message
            });
        }
        else {
            res.status(500).json({
                error: mappedError
            });
        }
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => {
    console.log(req.body);
    res.json({
        msg: "Login User",
        body: req.body
    });
};
exports.loginUser = loginUser;
