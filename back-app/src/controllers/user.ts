import { Request, Response } from "express";
import { admin } from '../db/conection';
import { mapFirebaseError } from '../utils/errorMapping';
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
    const { correo, password, tipo, nombre, apellidom, apellidop, telefono } = req.body;
    try {
        if (!correo || !password || !tipo || !nombre || !apellidom || !apellidop|| !telefono  ) {
            return res.status(400).json({ msg: "Faltan campos requeridos" });
          }
        // Validar que el tipo de usuario sea válido
        if (tipo !== 'doctor' && tipo !== 'paciente') {
            return res.status(400).json({
                msg: "Tipo de usuario inválido. Debe ser 'doctor' o 'paciente'."
            });
        }

        // Crear el usuario en Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email: correo,
            emailVerified: false,
            password: password,
            disabled: false,
        });


        // Guardar información adicional en Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            email: correo,
            role: tipo,
            nombre: nombre,
            apellidom:apellidom,
            apellidop:apellidop,
            telefono:telefono,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Asignar el tipo de usuario como un reclamo personalizado
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: tipo });

        res.status(200).json({
            msg: "Usuario creado exitosamente",
            uid: userRecord.uid,
            role: tipo
        });
    } catch (error) {
        console.error('Error creating new user:', error);
        const mappedError = mapFirebaseError(error);

        // Manejar errores específicos de Firebase Authentication
        if (mappedError.code === 'auth/email-already-in-use') {
            res.status(400).json({ msg: mappedError.message });
        } else if (mappedError.code === 'auth/invalid-email') {
            res.status(400).json({ msg: mappedError.message });
        } else if (mappedError.code === 'auth/operation-not-allowed') {
            res.status(500).json({ msg: mappedError.message });
        } else if (mappedError.code === 'auth/weak-password') {
            res.status(400).json({ msg: mappedError.message });
        } else {
            res.status(500).json({ error: mappedError });
        }
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      // Verificar si el usuario existe en Firebase Authentication
      const user = await admin.auth().getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
  
      // Si el usuario es válido, generamos un token JWT
      const token = jwt.sign(
        { uid: user.uid, email: user.email },  // Incluye el uid y email en el JWT
        'your-secret-key',  // Clave secreta de JWT
        { expiresIn: '1h' }  // El token expirará en 1 hora
      );
  
      // Respondemos con el JWT generado
      return res.status(200).json({
        msg: 'Usuario autenticado',
        token: token,  // Devuelves el token al frontend
      });
  
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      return res.status(500).json({ message: 'Error en la autenticación' });
    }
  };
const db = admin.firestore();
// Obtener todos los pacientes con sus permisos por doctor
export const listPacientes = async (req: Request, res: Response) => {
    
  const { doctorId } = req.body; // Obtén el doctorId desde el cuerpo de la solicitud
  try {
    if (!doctorId) {
      return res.status(400).json({ message: 'DoctorId es requerido' });
    }
    
    // Buscar todos los pacientes
    const usersSnapshot = await db.collection('users').where('role', '==', 'paciente').get();
    console.log(usersSnapshot.empty)
    if (usersSnapshot.empty) {
      return res.status(200).json([]); // Si no hay pacientes, devolvemos un array vacío
    }

    // Filtra pacientes que tienen permiso para el doctor
    const pacientesConPermiso = [];

    for (const doc of usersSnapshot.docs) {
      const paciente = doc.data();
      const pacienteId = doc.id;

      // Buscar el permiso de este paciente para el doctor específico
      const permisoDoc = await db.collection('permiso')
        .where('idPaciente', '==', db.collection('users').doc(pacienteId)) // Usamos referencia a documento
        .where('idDoctor', '==', db.collection('users').doc(doctorId)) // Usamos referencia a documento
        .get();

      let permiso = false; // Valor por defecto de permiso

      if (!permisoDoc.empty) {
        // Si existe el permiso, obtenerlo
        permiso = permisoDoc.docs[0].data().permiso;
      }

      // Agregar los datos del paciente junto con el permiso
      pacientesConPermiso.push({
        ...paciente, // Aquí se incluyen todos los campos del paciente
        idPaciente: pacienteId,
        permiso: permiso, // Agregar el permiso del paciente
      });
    }
    console.log(pacientesConPermiso)

    return res.status(200).json(pacientesConPermiso);

  } catch (error) {
    console.error('Error al listar pacientes:', error);
    return res.status(500).json({ message: 'Error al obtener los pacientes' });
  }
};

export const createOrUpdatePaciente = async (req: Request, res: Response) => {
  const { uid, nombre, sexo, edad, fechaNacimiento, alergias, antecedentesQuirurgicos, antecedentesPsicologicos, cardiopatia, vacunas, enfermedadesCronicas, medicacion, otros } = req.body;

  // Validación de campos requeridos
  if (!uid || !nombre || !sexo || !edad || !fechaNacimiento) {
    return res.status(400).json({ message: 'Campos requeridos faltantes' });
  }

  try {
    // Referencia al documento del paciente usando el uid
    const pacienteRef = db.collection('pacientes').doc(uid);

    // Obtener el documento del paciente
    const doc = await pacienteRef.get();

    // Si el paciente no existe, crear uno nuevo
    if (!doc.exists) {
      await pacienteRef.set({
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
    } else {
      // Si el paciente ya existe, actualizar los datos
      await pacienteRef.update({
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
  } catch (error) {
    console.error('Error al crear o actualizar paciente:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
};

export const getFichaMedica = async (req: Request, res: Response) => {
    const uid = req.params.uid;
    console.log(req)
    try {
      if (!uid) {
        return res.status(400).json({ message: 'El UID del paciente es requerido' });
      }
  
      // Buscar la ficha médica del paciente en la colección 'pacientes'
      const pacienteRef = db.collection('pacientes').doc(uid); // Usamos el UID para buscar el documento
      const pacienteDoc = await pacienteRef.get();
  
      if (!pacienteDoc.exists) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
  
      // Obtener los datos de la ficha médica
      const fichaMedica = pacienteDoc.data();
      console.log(fichaMedica)
      return res.status(200).json(fichaMedica); // Asegúrate de que esto sea JSON
  
    } catch (error) {
      console.error('Error al obtener la ficha médica:', error);
      return res.status(500).json({ message: 'Error al obtener la ficha médica' });
    }
  };