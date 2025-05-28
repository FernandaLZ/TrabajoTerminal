import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../services/auth-service.service"; // Importar Router

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatCard,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]], // Nombre requerido
      apellidoPaterno: ['', [Validators.required]], // Apellido paterno requerido
      apellidoMaterno: ['', [Validators.required]], // Apellido materno requerido
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Teléfono requerido con 10 dígitos
      email: ['', [Validators.required, Validators.email]], // Correo válido requerido
      password: ['', [Validators.required, Validators.minLength(6)]], // Contraseña requerida (mínimo 6 caracteres)
      tipo: ['doctor', [Validators.required]] // Tipo de usuario por defecto 'doctor'

    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const form = this.registerForm.value;
      const email = form.email;
      const password = form.password;

      const datosExtra = {
        nombre: form.nombre,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,
        telefono: form.telefono
      };

      this.authService.register(email, password, datosExtra).subscribe({
        next: (res) => {
          const uid = res.user?.uid;
          console.log('Registro exitoso:', uid);
          alert('Registro Exitoso')
          this.router.navigate([`/list/${uid}`]).then(_=>false); // ← Aquí rediriges con el UID
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert('Error en el registro:' + err);
        }
      });
    }
  }
}
