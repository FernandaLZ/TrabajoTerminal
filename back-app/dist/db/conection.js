"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebase = exports.admin = void 0;
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
const firebase = __importStar(require("firebase/app"));
exports.firebase = firebase;
require("firebase/auth");
var serviceAccount = require("C:\Users\ferna\Documents\TTKey\trabajoterminalpastillero-firebase-adminsdk-693lh-b332019e94.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const firebaseConfig = {
    apiKey: "AIzaSyCZVMvnr2KYFfuUoisoCNiSu8Fkye86PWQ",
    authDomain: "trabajoterminalpastillero.firebaseapp.com",
    projectId: "trabajoterminalpastillero",
    storageBucket: "trabajoterminalpastillero.appspot.com",
    messagingSenderId: "964856289687",
    appId: "1:964856289687:web:39191331d813abb7570cd2",
    measurementId: "G-N0X04JLYDE"
};
firebase.initializeApp(firebaseConfig);
