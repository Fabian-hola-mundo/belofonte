import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductsService } from '../../../../../../services/products.service';
import { FormsDataModel } from '../../../../interface/forms.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CreateProductThirdStep } from '../components/thirdStep/third.step.component';
import { CreateProductFirstStep } from '../components/firstStep/first.step.component';
import { CreateProductSecondStep } from '../components/secondStep/second.step.component';
import { CreateProductFourthtStep } from '../components/fourthStep/fourth.step.component';

const STEPS = [
  CreateProductFirstStep,
  CreateProductSecondStep,
  CreateProductThirdStep,
  CreateProductFourthtStep,
];

const MAT = [
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
];

const FORM = [ReactiveFormsModule, FormsModule];

@Component({
  selector: 'bel-create-product-container',
  standalone: true,
  imports: [CommonModule, ...STEPS, ...MAT, ...FORM],
  templateUrl: './create.product.container.component.html',
})
export class CreateProductContainer implements OnInit {
  createProductForm!: FormGroup;
  startForm!: FormGroup;
  formFourth: FormsDataModel = {
    input: 'input',
    label: 'Nombre',
    formControlName: 'ref'  
  };

  constructor(
    private _snackBar: MatSnackBar,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private side: MatSidenav
  ) { }

  ngOnInit() {

    this.startForm = this.formBuilder.group({
      control: this.formBuilder.group({
        ref: [''],
      }),
    })
    this.createProductForm = this.formBuilder.group({
      id: [''],
      category: [['']],
      subcategory: [['']],
      slug: ['', [Validators.required]],
      title: [''],
      description: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      characteristics: this.formBuilder.group({
        height: [''],
        broad: [''],
        weight: [''],
      }),
      inventory: this.formBuilder.array([this.createInventoryItem()]),
      control: this.formBuilder.group({
        ref: ['', [Validators.required]],
        totalStock: [0, [Validators.required, Validators.min(0)]],
      }),
    });
  }

  createInventoryItem(): FormGroup {
    return this.formBuilder.group({
      subRef: ['', [Validators.required]],
      size: ['', [Validators.required]],
      color: this.formBuilder.group({
        name: [''],
        hexa: [''],
      }),
      count: [0, [Validators.required, Validators.min(0)]],
      images: this.formBuilder.array([this.createImageItem()]),
    });
  }

  createImageItem(): FormGroup {
    return this.formBuilder.group({
      url: ['', [Validators.required]],
      alt: ['imagen', [Validators.required]],
    });
  }

  async onSubmit(): Promise<DocumentReference<any, DocumentData> | undefined> {
    try {
      if (this.startForm.valid) {
        const response = await this.productService.addProduct(this.startForm.value);
        this.side.close();
        this.startForm.reset();
        return response as DocumentReference<any, DocumentData>;
      } else {
        console.error('El formulario no es válido');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
    return undefined;
  }
}
