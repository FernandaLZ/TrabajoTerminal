import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
              private fb: FormBuilder,
              private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['doctor', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log(formData)
      this.userService.createUser(formData).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);
          alert('Usuario creado exitosamente');
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
