import {Component, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";

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
    NgIf,
    MatCard,
    MatError,
    RouterLink
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
    private fb: FormBuilder,
    private authService:AuthService,
    public router:Router
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

    // Usar el servicio para autenticar al usuario
    this.authService.login(email, password).subscribe(
      (response: any) => {
        this.loading = false;
        console.log('Usuario autenticado:', response.user);
        alert('Usuario autenticado exitosamente');

        // Guardar el token de Firebase en localStorage
        localStorage.setItem('token', response.user?.getIdToken());

        // Obtener el userId (puede ser response.user?.uid o el valor que necesites)
        const userId = response.user?.uid;

        // Redirigir a la página principal y pasar el userId como query param
        this.router.navigate(['/list', userId]);
      },
      (error) => {
        console.error(error)
        this.loading = false;
        this.error = 'Credenciales incorrectas';
        alert(this.error);
      }
    );
  }
}
