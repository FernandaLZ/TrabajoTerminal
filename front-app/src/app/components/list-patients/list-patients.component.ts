import {Component, OnInit} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-list-patients',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatIconButton,
    NgIf,
    MatButton
  ],
  templateUrl: './list-patients.component.html',
  styleUrl: './list-patients.component.scss'
})
export class ListPatientsComponent implements OnInit{
  displayedColumns = ['position', 'name', 'accions'];
  ELEMENT_DATA: Paciente[] =[];
  ngOnInit(){
    this.ELEMENT_DATA = [
      { position: 1, name: 'Alice Johnson', puedeVerFicha: true },
      { position: 2, name: 'Bob Smith', puedeVerFicha: false },
      { position: 3, name: 'Carlos Pérez', puedeVerFicha: true },
      { position: 4, name: 'Daniela Martínez', puedeVerFicha: false },
      { position: 5, name: 'Elena García', puedeVerFicha: true },
      { position: 6, name: 'Frank Wilson', puedeVerFicha: false },
      { position: 7, name: 'Gloria Fernández', puedeVerFicha: true },
      { position: 8, name: 'Hector Lopez', puedeVerFicha: false },
      { position: 9, name: 'Irene Rodríguez', puedeVerFicha: true },
      { position: 10, name: 'Jorge Torres', puedeVerFicha: false },
      { position: 11, name: 'Karen Lee', puedeVerFicha: true },
      { position: 12, name: 'Luis Hernández', puedeVerFicha: false },
      { position: 13, name: 'Maria Kim', puedeVerFicha: true },
      { position: 14, name: 'Nina Brown', puedeVerFicha: false },
      { position: 15, name: 'Oscar Díaz', puedeVerFicha: true },
      { position: 16, name: 'Patricia Cruz', puedeVerFicha: false },
      { position: 17, name: 'Quinn Navarro', puedeVerFicha: true },
      { position: 18, name: 'Roberto Soto', puedeVerFicha: false },
      { position: 19, name: 'Sofia Ramos', puedeVerFicha: true },
      { position: 20, name: 'Tomás Vega', puedeVerFicha: false },
    ];
  }

}
export interface Paciente {
  name: string;
  position: number;
  puedeVerFicha: boolean;
}


