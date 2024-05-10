import { Component } from '@angular/core';
import { DataModel } from '../../models/forms.model';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { ProductsService } from '../../../../../services copy/products.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatCheckboxModule, MatSelectModule ],
  templateUrl: './create.product.component.html',
  styleUrls: ['./create.product.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class CreateProductComponent {
  formulario!: any;
  rates: any = [1, 2, 3, 4, 5];

  firstData!: DataModel[];
  secondData!: DataModel[];

  ngOnInit(): void {
    this.createFirstStep();
    this.createSecondStep();
  }

  constructor(private productService: ProductsService) {
    this.formulario = new FormGroup({
      title: new FormControl(),
      description: new FormControl(),
      price: new FormControl(),
      image: new FormGroup({
        image1: new FormControl(),
        image2: new FormControl(),
        image3: new FormControl(),
      }),
      place: new FormControl(),
      stateOfProduct: new FormControl(),
    });
  }

  async onSubmit() {
    console.log(this.formulario.value);
    const response = await this.productService.addProduct(
      this.formulario.value
    );
    console.log(response);
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
        input: 'textarea',
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

  createSecondStep() {
    this.secondData = [
      {
        label: 'image',
        input: 'input',
        formControlName: 'image1',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image2',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image3',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image4',
      },
    ];
  }
}
