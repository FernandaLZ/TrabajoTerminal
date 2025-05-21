import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Método para iniciar sesión con Firebase
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          observer.next(userCredential);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Método para cerrar sesión
  logout(): void {
    this.afAuth.signOut();
  }
}
