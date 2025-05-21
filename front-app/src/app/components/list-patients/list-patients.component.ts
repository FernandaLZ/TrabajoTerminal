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
import {NavbarComponent} from "../../navbar/navbar.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

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
    MatButton,
    NavbarComponent
  ],
  templateUrl: './list-patients.component.html',
  styleUrl: './list-patients.component.scss'
})
export class ListPatientsComponent implements OnInit{
  displayedColumns = ['position', 'name', 'accions'];
  ELEMENT_DATA: Paciente[] =[];
  idDoctor
  constructor(
    private router: Router,
    private userService:UserService,
    private route: ActivatedRoute
              ) {
    this.idDoctor = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(){
    this.userService.listPacientes(this.idDoctor??'').subscribe({
      next:data=>{
        console.log(data)
        const dat:Paciente[]=data.map((val:any)=>{
          return {
            idPaciente:val.idPaciente,
            telefono: val.telefono,
            name: val.nombre +' '+ val.apellidop +' '+ val.apellidom,
            puedeVerFicha: val.permiso
          }
        })
        this.ELEMENT_DATA=dat;
      },
      error:err => {
        console.error(err)
      }
    })
  }

  consultarFichaMedica(idPaciente:string){
    this.router.navigate(['/record', this.idDoctor,idPaciente]).then(r => false);
  }

}
export interface Paciente {
  idPaciente:number;
  name: string;
  telefono: number;
  puedeVerFicha: boolean;
}


