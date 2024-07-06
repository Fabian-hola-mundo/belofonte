import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() firstStep = {
    
  }

  firstData!: FormsDataModel[];

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
        placeholder: 'Guitarra Mela',
        formControlName: 'description',
        required: true,
      },
      {
        input: 'input',
        label: 'Precio',
        type: 'number',
        placeholder: '25000',
        formControlName: 'price',
        required: true,
      },
    ];
  }
}
