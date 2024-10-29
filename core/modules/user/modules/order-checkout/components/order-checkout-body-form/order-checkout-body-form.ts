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
import { OrderCheckoutBodyFormStep3WompiComponent } from "./steps/order-checkout-body-form-step-3-wompi";
import { CartService } from '../../../../services/cart.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCBk20I8RH96ZSP-SmkgAN1_VGolzBQwoA",
  authDomain: "belofonte-sw.firebaseapp.com",
  databaseURL: "https://belofonte-sw-default-rtdb.firebaseio.com",
  projectId: "belofonte-sw",
  storageBucket: "belofonte-sw.appspot.com",
  messagingSenderId: "149350714862",
  appId: "1:149350714862:web:c73d7f37ec7fc89ba812ff",
  measurementId: "G-QSY5PVXTLJ"
};

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
    OrderCheckoutBodyFormStep2Component,
    OrderCheckoutBodyFormStep3WompiComponent,
/*     AngularFireModule.initializeApp(firebaseConfig),
    AngularFireFunctionsModule, */

],
  templateUrl: './order-checkout-body-form.html',
  styleUrl: './order-checkout-body-form.scss',
})
export class OrderCheckoutBodyFormComponent {
  productForm!: any;
  private _formBuilder = inject(FormBuilder);
  @ViewChild('stepper') stepper!: MatStepper;
  isEditable = true;
test = ''
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private fns: AngularFireFunctions
  ) {
    /* this.loadIntegrity() */
    console.log();

  }

  nextStep() {
    this.stepper.next();
  }
  prevStep() {
    this.stepper.previous();
  }

  async loadIntegrity() {
    const integrity = await this.fns.httpsCallable('getIntegrityKey')({}).toPromise();
    this.shoppingCart.patchValue({ integrity: integrity.integrity });
    this.test = integrity
    console.log(this.test);

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
    legalIdTypeCtrl: ['', Validators.required],
    idCtrl: ['', []],
  });

  shoppingCart = this._formBuilder.group({
    totalPrice: [this.cartService.getTotalPrice(), [Validators.required]],
    uniqueReference: [this.cartService.generateUniqueReference(), [Validators.required]],
    currency: ['COP',  [Validators.required]],
    publicKey: ['pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg', [Validators.required]],
    integrity: ['']
  })

  formCheckout = this._formBuilder.group({
    personalDetails: this.firstFormGroup,
    addressDetails: this.secondFormGroup,
    shoppingCart: this.shoppingCart,
  });




}
