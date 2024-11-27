import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ListPatientsComponent} from "./components/list-patients/list-patients.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'list', component: ListPatientsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirige a login por defecto
];
