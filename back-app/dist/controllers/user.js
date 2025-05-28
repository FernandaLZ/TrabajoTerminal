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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFichaMedica = exports.createOrUpdatePaciente = exports.listPacientes = exports.loginUser = exports.newUser = void 0;
const conection_1 = require("../db/conection");
const errorMapping_1 = require("../utils/errorMapping");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password, tipo, nombre, apellidom, apellidop, telefono } = req.body;
    try {
        if (!correo || !password || !tipo || !nombre || !apellidom || !apellidop || !telefono) {
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
            email: correo,
            emailVerified: false,
            password: password,
            disabled: false,
        });
        // Guardar información adicional en Firestore
        yield conection_1.admin.firestore().collection('users').doc(userRecord.uid).set({
            email: correo,
            role: tipo,
            nombre: nombre,
            apellidom: apellidom,
            apellidop: apellidop,
            telefono: telefono,
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
    try {
        // Verificar si el usuario existe en Firebase Authentication
        const user = yield conection_1.admin.auth().getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        // Si el usuario es válido, generamos un token JWT
        const token = jsonwebtoken_1.default.sign({ uid: user.uid, email: user.email }, // Incluye el uid y email en el JWT
        'your-secret-key', // Clave secreta de JWT
        { expiresIn: '1h' } // El token expirará en 1 hora
        );
        // Respondemos con el JWT generado
        return res.status(200).json({
            msg: 'Usuario autenticado',
            token: token, // Devuelves el token al frontend
        });
    }
    catch (error) {
        console.error('Error al verificar el usuario:', error);
        return res.status(500).json({ message: 'Error en la autenticación' });
    }
});
exports.loginUser = loginUser;
const db = conection_1.admin.firestore();
// Obtener todos los pacientes con sus permisos por doctor
const listPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.body; // Obtén el doctorId desde el cuerpo de la solicitud
    try {
        if (!doctorId) {
            return res.status(400).json({ message: 'DoctorId es requerido' });
        }
        // Buscar todos los pacientes
        const usersSnapshot = yield db.collection('users').where('role', '==', 'paciente').get();
        console.log(usersSnapshot.empty);
        if (usersSnapshot.empty) {
            return res.status(200).json([]); // Si no hay pacientes, devolvemos un array vacío
        }
        // Filtra pacientes que tienen permiso para el doctor
        const pacientesConPermiso = [];
        for (const doc of usersSnapshot.docs) {
            const paciente = doc.data();
            const pacienteId = doc.id;
            // Buscar el permiso de este paciente para el doctor específico
            const permisoDoc = yield db.collection('permiso')
                .where('idPaciente', '==', db.collection('users').doc(pacienteId)) // Usamos referencia a documento
                .where('idDoctor', '==', db.collection('users').doc(doctorId)) // Usamos referencia a documento
                .get();
            let permiso = false; // Valor por defecto de permiso
            if (!permisoDoc.empty) {
                // Si existe el permiso, obtenerlo
                permiso = permisoDoc.docs[0].data().permiso;
            }
            // Agregar los datos del paciente junto con el permiso
            pacientesConPermiso.push(Object.assign(Object.assign({}, paciente), { idPaciente: pacienteId, permiso: permiso }));
        }
        console.log(pacientesConPermiso);
        return res.status(200).json(pacientesConPermiso);
    }
    catch (error) {
        console.error('Error al listar pacientes:', error);
        return res.status(500).json({ message: 'Error al obtener los pacientes' });
    }
});
exports.listPacientes = listPacientes;
const createOrUpdatePaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, nombre, sexo, edad, fechaNacimiento, alergias, antecedentesQuirurgicos, antecedentesPsicologicos, cardiopatia, vacunas, enfermedadesCronicas, medicacion, otros } = req.body;
    // Validación de campos requeridos
    if (!uid || !nombre || !sexo || !edad || !fechaNacimiento) {
        return res.status(400).json({ message: 'Campos requeridos faltantes' });
    }
    try {
        // Referencia al documento del paciente usando el uid
        const pacienteRef = db.collection('pacientes').doc(uid);
        // Obtener el documento del paciente
        const doc = yield pacienteRef.get();
        // Si el paciente no existe, crear uno nuevo
        if (!doc.exists) {
            yield pacienteRef.set({
                nombre,
                sexo,
                edad,
                fechaNacimiento,
                alergias,
                antecedentesQuirurgicos,
                antecedentesPsicologicos,
                cardiopatia,
                vacunas,
                enfermedadesCronicas,
                medicacion,
                otros,
                createdAt: new Date(),
            });
            return res.status(201).json({ message: 'Paciente creado exitosamente' });
        }
        else {
            // Si el paciente ya existe, actualizar los datos
            yield pacienteRef.update({
                nombre,
                sexo,
                edad,
                fechaNacimiento,
                alergias,
                antecedentesQuirurgicos,
                antecedentesPsicologicos,
                cardiopatia,
                vacunas,
                enfermedadesCronicas,
                medicacion,
                otros,
                updatedAt: new Date(),
            });
            return res.status(200).json({ message: 'Paciente actualizado exitosamente' });
        }
    }
    catch (error) {
        console.error('Error al crear o actualizar paciente:', error);
        return res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});
exports.createOrUpdatePaciente = createOrUpdatePaciente;
const getFichaMedica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    console.log(req);
    try {
        if (!uid) {
            return res.status(400).json({ message: 'El UID del paciente es requerido' });
        }
        // Buscar la ficha médica del paciente en la colección 'pacientes'
        const pacienteRef = db.collection('pacientes').doc(uid); // Usamos el UID para buscar el documento
        const pacienteDoc = yield pacienteRef.get();
        if (!pacienteDoc.exists) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        // Obtener los datos de la ficha médica
        const fichaMedica = pacienteDoc.data();
        console.log(fichaMedica);
        return res.status(200).json(fichaMedica); // Asegúrate de que esto sea JSON
    }
    catch (error) {
        console.error('Error al obtener la ficha médica:', error);
        return res.status(500).json({ message: 'Error al obtener la ficha médica' });
    }
});
exports.getFichaMedica = getFichaMedica;
