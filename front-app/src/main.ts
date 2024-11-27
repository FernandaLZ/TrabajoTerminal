import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {Routes} from "@angular/router";
import {LoginComponent} from "./app/components/login/login.component";
import {RegisterComponent} from "./app/components/register/register.component";
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirige a login por defecto
];
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
