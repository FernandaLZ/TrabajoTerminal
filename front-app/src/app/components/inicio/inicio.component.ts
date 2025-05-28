import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgOptimizedImage} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatButton,
    NgOptimizedImage,
    MatCard,
    RouterLink
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
