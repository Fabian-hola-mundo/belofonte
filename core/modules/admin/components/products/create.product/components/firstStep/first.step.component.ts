import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CATEGORIES } from '../../../../../constants/catergorys';
import { FormsDataModel } from '../../../../../interface/forms.model';

const MAT = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatStepperModule,
  MatSelectModule,
]

const FORMS = [
  ReactiveFormsModule,
  FormsModule
]


@Component({
  selector: 'bel-create-product-first-step',
  standalone: true,
  imports: [
    CommonModule,
    ...MAT,
    ...FORMS,
  ],
  templateUrl: './first.step.component.html'
})
export class CreateProductFirstStep implements OnInit {
  categories = CATEGORIES;
  @Input() firstStep = {};
  firstData!: FormsDataModel[];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.createFirstStep();
  }

  createFirstStep() {
    this.firstData = [
      {
        input: 'input',
        label: 'Título',
        placeholder: 'Guitarra Mela',
        formControlName: 'title',
        required: true,
      },
      {
        input: 'input',
        label: 'Descripción',
        placeholder: 'Una breve descripción del producto',
        formControlName: 'description',
        required: true,
      },
      {
        input: 'input',
        label: 'Precio',
        type: 'text', // Cambiado a texto para manejar el formato
        placeholder: '25.000',
        formControlName: 'price',
        required: true,
      },
    ];
  }

  formatPrice(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    if (value) {
      value = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      })
        .format(Number(value))
        .replace('COP', '')
        .trim(); // Formatear como moneda sin el símbolo
    }
    input.value = `$ ${value} COP`; // Agregar formato de precio
    this.form.patchValue({ price: value.replace(/[^0-9]/g, '') }); // Guardar valor limpio en el formulario
  }
}
