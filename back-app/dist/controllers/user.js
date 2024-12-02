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
    const { nombre, password, tipo } = req.body;
    try {
        console.log(nombre);
        if (!nombre || !password || !tipo) {
            return res.status(400).json({ msg: "Faltan campos requeridos" });
        }
        // Validar que el tipo de usuario sea válido
        if (tipo !== 'doctor' && tipo !== 'paciente') {
            return res.status(400).json({
                msg: "Tipo de usuario inválido. Debe ser 'doctor' o 'paciente'."
            });
        }
        // Crear el usuario en Firebase Authentication
        const userRecord = yield conection_1.admin.auth().createUser({
            email: nombre,
            emailVerified: false,
            password: password,
            disabled: false,
        });
        console.log('Successfully created new user:', userRecord.uid);
        // Guardar información adicional en Firestore
        yield conection_1.admin.firestore().collection('users').doc(userRecord.uid).set({
            email: nombre,
            role: tipo,
            createdAt: conection_1.admin.firestore.FieldValue.serverTimestamp()
        });
        // Asignar el tipo de usuario como un reclamo personalizado
        yield conection_1.admin.auth().setCustomUserClaims(userRecord.uid, { role: tipo });
        res.status(200).json({
            msg: "Usuario creado exitosamente",
            uid: userRecord.uid,
            role: tipo
        });
    }
    catch (error) {
        console.error('Error creating new user:', error);
        const mappedError = (0, errorMapping_1.mapFirebaseError)(error);
        // Manejar errores específicos de Firebase Authentication
        if (mappedError.code === 'auth/email-already-in-use') {
            res.status(400).json({ msg: mappedError.message });
        }
        else if (mappedError.code === 'auth/invalid-email') {
            res.status(400).json({ msg: mappedError.message });
        }
        else if (mappedError.code === 'auth/operation-not-allowed') {
            res.status(500).json({ msg: mappedError.message });
        }
        else if (mappedError.code === 'auth/weak-password') {
            res.status(400).json({ msg: mappedError.message });
        }
        else {
            res.status(500).json({ error: mappedError });
        }
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    try {
        // Verificar si el usuario existe en Firebase Authentication
        const user = yield conection_1.admin.auth().getUserByEmail(email);
        console.log(user);
        // Si el usuario no existe o las credenciales son incorrectas
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        //const firebaseUser = await admin.auth().verifyIdToken(user.uid);
        //if (!firebaseUser) {
        //  return res.status(401).json({ message: 'No autorizado' });
        //}
        // Si el usuario es válido, generamos un token JWT
        //const token = jwt.sign(
        //  { uid: user.uid, email: user.email }, // Datos que quieres incluir en el token
        //  'your-secret-key', // Secreta de JWT
        //  { expiresIn: '1h' } // El token expirará en 1 hora
        //);
        // Respondemos con el token JWT
        //return res.json({ token });
        res.status(200).json({
            msg: "Usuario inicio sesion",
            uid: user.uid
        });
    }
    catch (error) {
        console.error('Error al autenticar el usuario:', error);
        return res.status(500).json({ message: 'Error en la autenticación' });
    }
});
exports.loginUser = loginUser;
