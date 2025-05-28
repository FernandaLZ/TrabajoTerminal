import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
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
import {isPlatformBrowser, NgIf} from "@angular/common";
import {NavbarComponent} from "../../navbar/navbar.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

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
  auth = inject(Auth);
  idDoctor

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,

    @Inject(PLATFORM_ID) private platformId: Object
              ) {
    this.idDoctor = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      this.listarPacientes();
    }
  }

  consultarFichaMedica(idPaciente:string){
    this.router.navigate(['/record', this.idDoctor,idPaciente]).then(_ => false);
  }
  listarPacientes() {
    this.authService.getPacientes().subscribe({
      next: (pacientes: any[]) => {
        console.log(pacientes)
        this.ELEMENT_DATA = pacientes.map((p) => {
          return {
            idPaciente: p.uid,
            name: p.nombre || p.apellidoPaterno || p.apellidoMaterno, // ajusta según tus campos reales
            telefono: p.telefono,
            puedeVerFicha: p.permiso ?? false
          };
        });
      },
      error: (err) => {
        alert('Error al obtener pacientes: ' + err.message);
        console.error(err)// para que veas también una alerta visual
      }
    });
  }

  solicitarPermiso(idPaciente: string) {
    this.authService.solicitarPermiso(this.idDoctor ?? '', idPaciente).subscribe({
      next: () => {

        alert('Permiso solicitado correctamente')
      },
      error: (err) => {
        console.error('Error al solicitar permiso:', err);
        alert('Error: ' + err.message);
      }
    });
  }
}
export interface Paciente {
  idPaciente:number;
  name: string;
  telefono: number;
  puedeVerFicha: boolean;
}


