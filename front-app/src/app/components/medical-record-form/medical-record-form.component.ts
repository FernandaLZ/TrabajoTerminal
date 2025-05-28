import {ApplicationRef, Component, Inject, NgZone, OnInit, PLATFORM_ID} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NavbarComponent} from "../../navbar/navbar.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";
import {DatePipe, isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {MatNativeDateModule} from "@angular/material/core";
import {MatIcon} from "@angular/material/icon";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-medical-record-form',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepickerModule,
    MatDatepicker,
    MatCheckbox,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    NavbarComponent,
    FormsModule,
    MatIconButton,
    MatHint,
    MatIcon,
    NgForOf,
    NgIf,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner,
    DatePipe
  ],
  templateUrl: './medical-record-form.component.html',
  styleUrl: './medical-record-form.component.scss'
})
export class MedicalRecordFormComponent implements OnInit{
  medicalForm: FormGroup;
  idPaciente
  idDoctor
  recetas: any[] = [];
  cargando = true;


  constructor(private fb: FormBuilder,
              private router: Router,
              private authService:AuthService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private route: ActivatedRoute) {
    this.idDoctor = this.route.snapshot.paramMap.get('id');
    this.idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    // Inicializamos el formulario
    this.medicalForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      sexo: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      fechaNacimiento: ['', Validators.required],
      alergias: [''],
      antecedentesQuirurgicos: [''],
      antecedentesPsicologicos: [''],
      cardiopatia: [''],
      antecedentesDigestivos: [''],
      antecedentesHematologicos: [''],
      antecedentesTraumatologicos: [''],
      antecedentesInfecciosos: [''],
      antecedentesNeurologicos: [''],
      vacunas: [''],
      enfermedadesCronicas: [''],
      medicacion: [''],
      otros: [''],
      contactos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.medicalForm.get('nombreCompleto')?.disable();
    if (isPlatformBrowser(this.platformId)) {
      this.getFicha();
      this.getReceta();
    }

  }
  getFicha(){
    this.authService.getFichaMedica(this.idPaciente??'').subscribe({
      next:ficha=>{
        console.log('FM',ficha)
        if (ficha && ficha.fechaNacimiento && ficha.fechaNacimiento.seconds) {
          ficha.fechaNacimiento = new Date(ficha.fechaNacimiento.seconds * 1000);
        }
        this.medicalForm.patchValue(ficha)
        this.contactos.clear();
        // Llena contactos en el FormArray
        if (ficha && ficha.contactos && ficha.contactos.length > 0) {
          console.log(ficha.contactos)
          ficha.contactos.forEach((contacto: any) => {
            this.contactos.push(this.crearContacto(contacto));
          });
        } else {
          // Si no hay contactos, al menos un grupo vacío
          this.contactos.push(this.crearContacto());
        }
      },
      error:err => {
        console.error(err)
      }
    })
  }

  // Función para enviar el formulario
  onSubmit(): void {
    if (this.medicalForm.valid) {
      console.log(this.medicalForm.value);
      const data={
        uid:this.idPaciente,
        ...this.medicalForm.value
      }
      this.authService.guardarFichaMedica(this.medicalForm.value,this.idPaciente??'').subscribe({
        next:_=>{
          alert('Ficha Medica guardada exitosamente.')
        },
        error:err => {
          console.error(err)
        }
      })
      // Aquí podrías hacer algo con los datos, como enviarlos al servidor
    } else {
      console.log('Formulario no válido');
    }
  }


  agregarContacto(): void {
    this.contactos.push(this.crearContacto());
  }

  eliminarContacto(index: number): void {
      this.contactos.removeAt(index);
  }
  get contactos(): FormArray {
    return this.medicalForm.get('contactos') as FormArray;
  }

  crearContacto(contacto?: any): FormGroup {
    return this.fb.group({
      nombre: [contacto?.nombre || '', Validators.required],
      telefono: [contacto?.telefono || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  private getReceta() {
    this.authService.getRecetasPaciente(this.idPaciente??'').subscribe({
      next:receta=>{
        console.log(receta)
        this.recetas=receta
        this.cargando=false
      },
      error:err => {
        console.error(err)
        this.cargando = false;
      }
    })
  }

  irReceta(idReceta:string) {
    this.router.navigate(['/receta', this.idDoctor, this.idPaciente, idReceta]).then(_=>false);
  }

  agregarReceta() {
    this.authService.createReceta(this.idPaciente??'',this.idDoctor??'').subscribe({
      next:receta=>{
        console.log('RecetaCreada',receta)
        this.router.navigate(['/receta', this.idDoctor, this.idPaciente, receta.id]).then(_=>false);
      },
      error:err => {
        alert('Error'+err)
        console.error(err);
      }
    })

  }
}
