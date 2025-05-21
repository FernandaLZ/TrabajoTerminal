import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {NavbarComponent} from "../../navbar/navbar.component";

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
    NavbarComponent
  ],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class RecetaComponent implements OnInit{
  recipeForm: FormGroup;
  allergies: boolean = false;
  patientData: any = null; // Aquí se almacenarán los datos del paciente si ya existe una ficha médica

  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      nombre: ['', Validators.required],
      fecha: ['', Validators.required],
      peso: ['', Validators.required],
      talla: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      alergias: [''],
      descripcionAlergias: [''],
      receta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aquí simulas la carga de datos del paciente, que normalmente vendría de una base de datos
    this.loadPatientData();
  }

  // Función para cargar los datos del paciente, por ejemplo, de una API o base de datos
  loadPatientData() {
    // Simulando un paciente con ficha médica existente
    this.patientData = {
      nombre: 'Juan Pérez',
      peso: 70,
      talla: 175,
      edad: 30
    };

    if (this.patientData) {
      this.recipeForm.patchValue(this.patientData); // Autocompleta los campos del paciente
    }
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
      console.log(this.recipeForm.value);
      // Aquí normalmente enviarías los datos al servidor para guardarlos
    } else {
      console.log('Formulario no válido');
    }
  }

  // Función para imprimir la receta
  printRecipe() {
    const receta = this.recipeForm.value;
    const recetaContent = `
      Receta Médica
      Nombre: ${receta.nombre}
      Fecha: ${receta.fecha}
      Peso: ${receta.peso}
      Talla: ${receta.talla}
      Edad: ${receta.edad}
      Alergias: ${receta.alergias ? 'Sí' : 'No'}
      Descripción de Alergias: ${receta.descripcionAlergias || 'No especificada'}
      Receta: ${receta.receta}
    `;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write(`<pre>${recetaContent}</pre>`);
    printWindow?.document.close();
    printWindow?.print();
  }
}
