import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {catchError, forkJoin, from, map, Observable, of, switchMap, throwError} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {collection, DocumentSnapshot} from '@angular/fire/firestore';
import {doc} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}

  // Método para iniciar sesión con Firebase
  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(async userCredential => {
          const token = await userCredential.user?.getIdToken();
          observer.next({ user: userCredential.user, token }); // ⬅️ devuelves el token también
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  guardarFichaMedica(formData: any, uidPaciente: string): Observable<void> {
    const fichaRef = this.firestore.collection('FichaMedica').doc(uidPaciente);
    const now = Timestamp.now();
    const uidPacienteRef = this.firestore.doc(`users/${uidPaciente}`).ref;

    return from(fichaRef.get()).pipe(
      switchMap(docSnapshot => {
        const dataToSave = {
          ...formData,
          uidPaciente: uidPacienteRef,
          ultimaModificacion: now
        };

        if (docSnapshot.exists) {
          return from(fichaRef.update(dataToSave));
        } else {
          return from(fichaRef.set({
            ...dataToSave,
            fechaCreacion: now
          }));
        }
      })
    );
  }

  getFichaMedica(uidPaciente: string): Observable<any | null> {
    const fichaRef = this.firestore.collection('FichaMedica').doc(uidPaciente);
    const uidPacienteRef = this.firestore.doc(`users/${uidPaciente}`).ref;
    const userRef = this.firestore.collection('users').doc(uidPaciente);
    const now = Timestamp.now();

    return from(fichaRef.get()).pipe(
      switchMap(docSnapshot => {
        if (docSnapshot.exists) {
          return of(docSnapshot.data());
        } else {
          return from(userRef.get()).pipe(
            switchMap(userSnap => {
              const userData = userSnap.data() as {
                nombre?: string;
                apellidoPaterno?: string;
                apellidoMaterno?: string;
                sexo?: string;
                fechaNacimiento?: any;
              };

              const nombreCompleto = `${userData?.nombre || ''} ${userData?.apellidoPaterno || ''} ${userData?.apellidoMaterno || ''}`.trim();

              const defaultData = {
                uidPaciente: uidPacienteRef,
                nombreCompleto,
                edad: null,
                fechaNacimiento: userData?.fechaNacimiento || null,
                sexo: userData?.sexo || '',
                alergias: '',
                antecedentesDigestivos: '',
                antecedentesHematologicos: '',
                antecedentesInfecciosos: '',
                antecedentesNeurologicos: '',
                antecedentesPsicologicos: false,
                antecedentesQuirurgicos: '',
                antecedentesTraumatologicos: '',
                cardiopatia: '',
                enfermedadesCronicas: '',
                medicacion: '',
                otros: '',
                vacunas: '',
                contactos: [],
                fechaCreacion: now,
                ultimaModificacion: now
              };

              return from(fichaRef.set(defaultData)).pipe(
                map(() => defaultData)
              );
            })
          );
        }
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  getRecetaConFichaMedica(recetaId: string): Observable<any> {
    const recetaDoc = this.firestore.collection('Recetas').doc(recetaId);

    return from(recetaDoc.get()).pipe(
      switchMap((recetaSnap: any) => {
        const recetaData = recetaSnap.data();
        if (!recetaData) throw new Error('No se encontró la receta');

        const uidDoctorPath = recetaData.uidDoctor?.path;
        const uidPacientePath = recetaData.uidPaciente?.path;
        const uidDoctor = recetaData.uidDoctor.id
        const uidPacienteRef =this.firestore.doc(uidPacientePath).ref
        console.log(uidPacienteRef)

        // Obtener nombre del doctor
        const doctor$ = this.firestore.collection('users').doc(uidDoctor).get().pipe(
          map((docSnap: any) => docSnap.data()?.nombre + ' ' + docSnap.data()?.apellidoPaterno + ' ' + docSnap.data()?.apellidoMaterno || 'Sin nombre')
        );

        // Obtener ficha médica por idPaciente e idDoctor
        const ficha$ = this.firestore.collection('FichaMedica', ref =>
          ref.where('uidPaciente', '==', uidPacienteRef)
        ).get().pipe(
          map((querySnap: any) => {
            const ficha = querySnap.docs[0]?.data();
            if (!ficha) throw new Error('No se encontró la ficha médica');

            return {
              nombrePaciente: ficha.nombreCompleto || 'Sin nombre',
              fechaNacimiento: ficha.fechaNacimiento?.toDate?.() || null,
              edad: ficha.edad || null,
              ...ficha
            };
          })
        );

        return forkJoin({ nombreDoctor: doctor$, ficha: ficha$ }).pipe(
          map(({ nombreDoctor, ficha }) => ({
            id: recetaSnap.id,
            ...recetaData,
            nombreDoctor,
            ...ficha
          }))
        );
      }),
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
  actualizarReceta(idReceta: string, data: Partial<any>): Observable<void> {
    return from(
      this.firestore.collection('Recetas').doc(idReceta).update(data)
    );
  }
  getRecetasPaciente(uidPaciente: string): Observable<any[]> {
    return this.firestore.collection('Recetas', ref =>
      ref.where('uidPaciente', '==', this.firestore.doc(`users/${uidPaciente}`).ref)
        .orderBy('fechaCreacion', 'desc')
    ).get().pipe(
      switchMap(querySnapshot => {
        const recetas = querySnapshot.docs.map(doc => {
          const recetaData = doc.data();
          return recetaData ? { ...recetaData, id: doc.id } : { id: doc.id };
        });

        // Obtener todas las promesas para los doctores
        const recetasConDoctor$ = recetas.map((receta:any) => {
          if (receta.uidDoctor) {
            return receta.uidDoctor.get().then((doctorDoc: DocumentSnapshot<any>) => {
              const doctorData = doctorDoc.data();
              return {
                ...receta,
                nombreDoctor: doctorData?.nombre + ' ' + doctorData?.apellidoPaterno + ' ' + doctorData?.apellidoMaterno || 'Sin nombre'
              };
            });
          } else {
            return Promise.resolve({
              ...receta,
              nombreDoctor: 'Sin referencia de doctor'
            });
          }
        });

        return from(Promise.all(recetasConDoctor$));
      }),
      catchError(error => {
        console.error('Error obteniendo recetas con doctor:', error);
        return of([]); // Retorna array vacío si hay error
      })
    );
  }

  createReceta(uidPaciente: string, idDoctorUid: string): Observable<any> {
    return from(this.afAuth.currentUser).pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('No hay usuario autenticado');
        }
        if (user.uid !== idDoctorUid) {
          throw new Error('Usuario autenticado no coincide con el doctor');
        }

        const idDoctorRef = this.firestore.doc(`users/${idDoctorUid}`).ref;
        const idPacienteRef = this.firestore.doc(`users/${uidPaciente}`).ref;

        const data = {
          uidPaciente:idPacienteRef,
          uidDoctor: idDoctorRef,
          fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
          fechaUltimaModificacion: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Luego hacemos set con los datos
        const docRef = this.firestore.collection('Recetas').doc();

        return from(docRef.set(data)).pipe(
          map(() => ({ id: docRef.ref.id }))
        );
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState; // ⬅️ observable del usuario autenticado
  }

  register(email: string, password: string, datosExtra: any): Observable<any> {
    return new Observable(observer => {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const uid = userCredential.user?.uid;
          if (uid) {
            const data = {
              uid,
              email,
              rol: 'doctor',
              createdAt: firebase.firestore.FieldValue.serverTimestamp(), // 👈 aquí se agrega createdAt
              ...datosExtra // nombre, apellidos, teléfono, etc.
            };

            this.firestore.collection('users').doc(uid).set(data)
              .then(() => {
                observer.next(userCredential);
                observer.complete();
              })
              .catch(error => observer.error(error));
          } else {
            observer.error(new Error('No se obtuvo UID del usuario'));
          }
        })
        .catch(error => observer.error(error));
    });
  }
  getPacientes(): Observable<any[]> {
    return this.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) return of([]);

        return from(this.firestore.collection('users', ref =>
          ref.where('rol', '==', 'paciente')).get()
        ).pipe(
          switchMap(snapshot => {
            if (snapshot.empty) return of([]);

            const pacientes = snapshot.docs.map(doc => ({
              id: doc.id,
              ...(doc.data() as any)
            }));

            // Consulta los permisos donde idDoctor es igual al usuario actual
            return from(this.firestore.collection('Permisos', ref =>
              ref.where('idDoctor', '==', this.firestore.doc(`users/${user.uid}`).ref)
            ).get()).pipe(
              map(permSnapshot => {
                const permisos = permSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...(doc.data() as any)
                }));

                // Mezclar pacientes con su permiso correspondiente
                return pacientes.map(paciente => {
                  const permiso = permisos.find(p =>
                    p.idPaciente?.id === `${paciente.id}`
                  );
                  return {
                    ...paciente,
                    permiso: permiso?.permiso ?? null,
                    permisoSolicitado: permiso?.permisoSolicitado ?? null
                  };
                });
              })
            );
          }),
          catchError(err => {
            console.error('Error en getPacientes', err);
            return throwError(() => err);
          })
        );
      })
    );
  }
  solicitarPermiso(idDoctorUid: string, idPacienteUid: string): Observable<void> {
    return from(this.afAuth.currentUser).pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('No hay usuario autenticado');
        }
        if (user.uid !== idDoctorUid) {
          throw new Error('Usuario autenticado no coincide con el doctor');
        }

        const idDoctorRef = this.firestore.doc(`users/${idDoctorUid}`).ref;
        const idPacienteRef = this.firestore.doc(`users/${idPacienteUid}`).ref;

        // Hacer la consulta correctamente
        return from(
          this.firestore.collection('Permisos', ref =>
            ref.where('idDoctor', '==', idDoctorRef)
              .where('idPaciente', '==', idPacienteRef)
          ).get()
        ).pipe(
          switchMap(snapshot => {
            if (!snapshot.empty) {
              const updates = snapshot.docs.map(doc =>
                this.firestore.collection('Permisos').doc(doc.id).update({
                  permiso: false,
                  permisoSolicitado: true
                })
              );
              return from(Promise.all(updates)).pipe(map(() => {}));
            } else {
              return from(
                this.firestore.collection('Permisos').add({
                  idDoctor: idDoctorRef,
                  idPaciente: idPacienteRef,
                  permiso: false,
                  permisoSolicitado: true
                })
              ).pipe(map(() => {}));
            }
          })
        );
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    this.afAuth.signOut();
  }
}
