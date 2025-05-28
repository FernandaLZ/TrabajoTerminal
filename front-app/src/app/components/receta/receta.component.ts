import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {NavbarComponent} from "../../navbar/navbar.component";
import {ActivatedRoute} from "@angular/router";
import {isPlatformBrowser, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth-service.service";

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatCheckbox,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    NavbarComponent,
    NgIf
  ],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class RecetaComponent implements OnInit{
  recipeForm: FormGroup;
  allergies: boolean = false;
  patientData: any = null; // Aquí se almacenarán los datos del paciente si ya existe una ficha médica
  idPaciente
  idDoctor
  idReceta

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService:AuthService,
  ) {
    this.idDoctor = this.route.snapshot.paramMap.get('id');
    this.idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    this.idReceta = this.route.snapshot.paramMap.get('idReceta');


    this.recipeForm = this.fb.group({
      nombreDoctor:[{value:'',disabled:true},Validators.required],
      fechaCreacion:[{value:'',disabled:true},Validators.required],
      nombreCompleto: [{value:'',disabled:true}, Validators.required],
      fechaNacimiento: [{value:'',disabled:true}, Validators.required],
      edad: [{value:'',disabled:true}, [Validators.required, Validators.min(1)]],
      peso: ['', Validators.required],
      talla: ['', Validators.required],
      alergias: [''],
      descripcionAlergias: [''],
      receta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPatientData();
    }
    // Aquí simulas la carga de datos del paciente, que normalmente vendría de una base de datos
  }


  // Función para cargar los datos del paciente, por ejemplo, de una API o base de datos
  loadPatientData() {
    // Simulando un paciente con ficha médica existente
    this.authService.getRecetaConFichaMedica(this.idReceta??'').subscribe({
      next:receta=>{
        if (receta && receta.fechaCreacion && receta.fechaCreacion.seconds) {
          receta.fechaCreacion = new Date(receta.fechaCreacion.seconds * 1000);
        }
        if (receta && receta.fechaNacimiento && receta.fechaNacimiento.seconds) {
          receta.fechaNacimiento = new Date(receta.fechaNacimiento.seconds * 1000);
        }
        this.recipeForm.patchValue(receta);
      },
      error:err => {
        console.error(err)
      }
    })
  }

  // Habilita o deshabilita el campo de descripción de alergias dependiendo del checkbox
  onAlergiaChange(event: any) {
    this.allergies = event.checked;
    if (!this.allergies) {
      this.recipeForm.get('descripcionAlergias')?.setValue('');
    }
  }

  // Función para enviar el formulario
  onSubmit() {
    if (this.recipeForm.valid) {
      const data = this.recipeForm.value; // solo campos habilitados
      this.authService.actualizarReceta(this.idReceta??'', data).subscribe({
        next: () => {
          console.log('Receta actualizada correctamente');
          alert('Receta actualizada correctamente')
        },
        error: (err) => {
          console.error('Error al actualizar la receta:', err);
          alert('Error al actualizar la receta:'+ err)
        }
      });
    } else {
      console.log('Formulario no válido');
      alert('Formulario no válido')
    }
  }

  // Función para imprimir la receta
  printRecipe() {
    this.authService.getRecetaConFichaMedica(this.idReceta??'').subscribe({
      next:receta=>{
        if (receta && receta.fechaCreacion && receta.fechaCreacion.seconds) {
          receta.fechaCreacion = new Date(receta.fechaCreacion.seconds * 1000);
        }
        if (receta && receta.fechaNacimiento && receta.fechaNacimiento.seconds) {
          receta.fechaNacimiento = new Date(receta.fechaNacimiento.seconds * 1000);
        }
        const recetaContent = `
        Receta Médica
        Doctor: ${receta.nombreDoctor}     Fecha: ${receta.fechaCreacion}
        Nombre: ${receta.nombreCompleto}
        Peso: ${receta.peso}
        Talla: ${receta.talla}
        Edad: ${receta.edad}
        Alergias: ${receta.alergias ? 'Sí' : 'No'}
        Receta: ${receta.receta}`;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write(`<pre>${recetaContent}</pre>`);
        printWindow?.document.close();
        printWindow?.print();
      },
      error:err => {
        console.error(err)
      }
    })
  }
}
