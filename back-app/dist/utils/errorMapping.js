"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFirebaseError = void 0;
const mapFirebaseError = (error) => {
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
        const firebaseError = error;
        switch (firebaseError.code) {
            case 'auth/email-already-in-use':
                return { code: firebaseError.code, message: 'The email address is already in use by another account.' };
            case 'auth/invalid-email':
                return { code: firebaseError.code, message: 'The email address is not valid.' };
            case 'auth/operation-not-allowed':
                return { code: firebaseError.code, message: 'Email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.' };
            case 'auth/weak-password':
                return { code: firebaseError.code, message: 'The password is too weak.' };
            default:
                return { code: firebaseError.code, message: firebaseError.message };
        }
    }
    return {
        code: 'unknown-error',
        message: 'An unknown error occurred',
    };
};
exports.mapFirebaseError = mapFirebaseError;
