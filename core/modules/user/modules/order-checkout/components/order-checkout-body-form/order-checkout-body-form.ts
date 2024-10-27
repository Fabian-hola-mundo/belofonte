import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OrderCheckoutBodyFormStep1Component } from "./steps/order-checkout-body-form-step-1";
import { OrderCheckoutBodyFormStep2Component } from "./steps/order-checkout-body-form-step-2";

@Component({
  selector: 'bel-order-checkout-body-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    OrderCheckoutBodyFormStep1Component,
    OrderCheckoutBodyFormStep2Component
],
  templateUrl: './order-checkout-body-form.html',
  styleUrl: './order-checkout-body-form.scss',
})
export class OrderCheckoutBodyFormComponent {
  productForm!: any;
  private _formBuilder = inject(FormBuilder);
  @ViewChild('stepper') stepper!: MatStepper;
  isEditable = true;

  nextStep() {
    this.stepper.next();
  }
  prevStep() {
    this.stepper.previous();
  }


  secondFormGroup = this._formBuilder.group({
     address: ['', Validators.required],
     aditiionalAddress: ['', []],
     departamento: ['', Validators.required],
     municipio: [{ value: '', disabled: true }, Validators.required], // Municipio está deshabilitado inicialmente
     postalCode: ['', []],  // Nuevo campo para código postal
  });

  firstFormGroup = this._formBuilder.group({
    mailCtrl: ['', [Validators.required, Validators.email]],
    nameCtrl: ['', Validators.required],
    phoneCtrl: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // solo números
    idCtrl: ['', []],
  });

  constructor(private formBuilder: FormBuilder) {

  }


}
