import { Request, Response } from "express";
import { UserCredential, AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase,admin } from '../db/conection';
import { mapFirebaseError } from '../utils/errorMapping';
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
    const { correo, password, tipo, nombre, apellidom, apellidop, telefono } = req.body;

    try {
        console.log(correo)
        if (!correo || !password || !tipo) {
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

        console.log('Successfully created new user:', userRecord.uid);

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
    console.log(email)
    try {
      // Verificar si el usuario existe en Firebase Authentication
      const user = await admin.auth().getUserByEmail(email);
      console.log(user)
      
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
  
    } catch (error) {
      console.error('Error al autenticar el usuario:', error);
      return res.status(500).json({ message: 'Error en la autenticación' });
    }
  };