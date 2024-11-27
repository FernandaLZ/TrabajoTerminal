import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {Router} from "express";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private userService: UserService, // Inyecta el servicio
    //private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit() {
    console.log('Hola')
  }

  onSubmit() {
    this.loading = true;
    const { email, password } = this.loginForm.value;
    console.log(this.loginForm.value)
    // Usar el servicio para autenticar al usuario
    this.userService.login(email, password).subscribe(
      (response: any) => {
        this.loading = false;
        console.log('response')
        alert('Usuario Inico Sesion Exitosamente')
        //localStorage.setItem('token', response.token); // Guardar el token en localStorage
      },
      (error) => {
        this.loading = false;
        this.error = 'Credenciales incorrectas';
        alert(this.error)
      }
    );
  }
}
