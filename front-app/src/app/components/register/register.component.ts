import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {MatCard} from "@angular/material/card";
import {Router, RouterLink} from '@angular/router'; // Importar Router

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
    private userService: UserService,
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
      const formData = this.registerForm.value;
      console.log('Formulario enviado:', formData);
      const form={
        correo: this.registerForm.get('email')?.value,
        password:this.registerForm.get('password')?.value,
        tipo:this.registerForm.get('tipo')?.value,
        nombre:this.registerForm.get('nombre')?.value,
        apellidom:this.registerForm.get('apellidoMaterno')?.value,
        apellidop:this.registerForm.get('apellidoPaterno')?.value,
        telefono:this.registerForm.get('telefono')?.value
      }

      this.userService.createUser(form).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);
          alert('Usuario creado exitosamente');
          this.router.navigate(['/list']).then(r => false);
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
          alert('Hubo un error al crear el usuario');
        }
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
