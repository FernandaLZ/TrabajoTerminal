import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {MatBadge} from "@angular/material/badge";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AuthService} from "../services/auth-service.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatBadge,
    MatIconButton,
    MatButton
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(
    private authService:AuthService,
    private router: Router,
  ) {
  }
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['']).then(_=>false);
  }
}
