import { Request, Response } from "express";
import { UserCredential, AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { firebase,admin } from '../db/conection';
import { mapFirebaseError } from '../utils/errorMapping';

export const newUser = async (req: Request, res: Response) => {
    const { nombre, password } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
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
    } catch (error) {
        console.error('Error creating new user:', error);
        const mappedError = mapFirebaseError(error);
        if(mappedError.code=='auth/email-already-in-use'){
            res.status(400).json({
                msg: mappedError.message
            })
        }else if('auth/invalid-email'){
            res.status(400).json({
                msg: mappedError.message
            })
        }else if('auth/operation-not-allowed'){
            res.status(500).json({
                msg: mappedError.message
            })
        }else if('auth/weak-password'){
            res.status(400).json({
                msg: mappedError.message
            })
        }else{
            res.status(500).json({
                error: mappedError
            });
        }
    }
};

export const loginUser = (req:Request,res:Response) =>{
    
    console.log(req.body);
    
    res.json({
        msg:"Login User",
        body: req.body
    })
}