import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';
import 'firebase/auth';

var serviceAccount = require("../../trabajoterminalpastillero-firebase-adminsdk-693lh-b332019e94.json");

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
export { admin, firebase };