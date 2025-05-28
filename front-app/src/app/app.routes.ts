import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ListPatientsComponent} from "./components/list-patients/list-patients.component";
import {MedicalRecordFormComponent} from "./components/medical-record-form/medical-record-form.component";
import {RecetaComponent} from "./components/receta/receta.component";
import {InicioComponent} from "./components/inicio/inicio.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'list/:id', component: ListPatientsComponent },
  { path: 'record/:id/:idPaciente', component: MedicalRecordFormComponent },
  { path: 'receta/:id/:idPaciente/:idReceta', component: RecetaComponent },
  { path: 'inicio', component: InicioComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' } // Redirige a login por defecto
];
