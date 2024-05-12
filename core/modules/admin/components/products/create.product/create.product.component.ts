import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ProductsService } from '../../../../../services/products.service';
import { DataModel } from '../../../interface/forms.model';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { CATEGORIES } from '../../../constants/catergorys';

const MAT = [
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatCheckboxModule,
  MatButtonModule,
  MatSelectModule,
  TextFieldModule,
]

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT
  ],
  templateUrl: './create.product.component.html',
  styleUrls: ['./create.product.component.scss'],

})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;

  categories = CATEGORIES
  rates: any = [1, 2, 3, 4, 5];

  firstData!: DataModel[];
  secondData!: DataModel[];

  ngOnInit(): void {

    this.createFirstStep();
    this.createSecondStep();
  }

  constructor(private productService: ProductsService) {
    this.productForm = new FormGroup({
      title: new FormControl(),
      description: new FormControl(),
      category: new FormControl(),
      price: new FormControl(),
      image: new FormGroup({
        image1: new FormControl(),
        image2: new FormControl(),
        image3: new FormControl(),
        image4: new FormControl(),
      }),
      place: new FormControl(),
      stateOfProduct: new FormControl(),
    });

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

  async onSubmit() {
    const response = await this.productService.addProduct(
      this.productForm.value
    );
    console.log(response);
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
