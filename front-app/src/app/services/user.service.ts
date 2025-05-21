import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3000/api/users'; // URL base del backend
  private loginUrl = 'http://127.0.0.1:3000/api/users/login';
  private listUrl = 'http://127.0.0.1:3000/api/users/list';
  private pacienteUrl = 'http://127.0.0.1:3000/api/users/paciente';

  constructor(private http: HttpClient) {}

  createUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password });
  }

  listPacientes(doctorId:string): Observable<any> {
    return this.http.post<any>(this.listUrl,{doctorId});
  }
  createOrUpdatePaciente(pacienteData: any): Observable<any> {
    return this.http.post<any>(this.pacienteUrl, pacienteData); // Enviar los datos al backend
  }
  getPaciente(uid: string): Observable<any> {
    const url = `http://localhost:3000/api/users/pacientes/${uid}`; // Concatenar el uid en la URL
    return this.http.get<any>(url); // Hacer la solicitud GET sin enviar el cuerpo
  }
  // Método para obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Retorna true si hay un token
  }

  // Método para hacer logout
  logout(): void {
    localStorage.removeItem('token');
  }
}
