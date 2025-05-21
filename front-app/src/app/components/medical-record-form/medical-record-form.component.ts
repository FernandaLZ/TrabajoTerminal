import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NavbarComponent} from "../../navbar/navbar.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import daisyui from "daisyui";

@Component({
  selector: 'app-medical-record-form',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatError,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepicker,
    MatCheckbox,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
    NavbarComponent,
    FormsModule,
    MatIconButton
  ],
  templateUrl: './medical-record-form.component.html',
  styleUrl: './medical-record-form.component.scss'
})
export class MedicalRecordFormComponent {
  medicalForm: FormGroup;
  idPaciente
  idDoctor

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService:UserService,
              private route: ActivatedRoute) {
    this.idDoctor = this.route.snapshot.paramMap.get('id');
    this.idPaciente = this.route.snapshot.paramMap.get('idPaciente');
    // Inicializamos el formulario
    this.medicalForm = this.fb.group({
      nombre: ['', Validators.required],
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
      otros: ['']
    });
  }

  ngOnInit(): void {
    console.log(this.idPaciente)
    this.userService.getPaciente(this.idPaciente??'').subscribe({
      next:data=>{
        this.medicalForm.patchValue(data);
        console.log(data)
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
      this.userService.createOrUpdatePaciente(data).subscribe({
        next:_=>{
          alert('Ficha actualizada')
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
}
