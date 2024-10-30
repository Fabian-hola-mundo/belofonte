import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Renderer2, signal, ViewChild } from '@angular/core';
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
  @ViewChild('wompiForm') wompiForm!: ElementRef<HTMLFormElement>;
  isEditable = true;
  private renderer = inject(Renderer2);
test = ''
  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    /* private fns: AngularFireFunctions */
  ) {
    /* this.loadIntegrity() */
  }

  nextStep() {
    this.stepper.next();
  }
  prevStep() {
    this.stepper.previous();
  }

  goToPay(){
    if (this.formCheckout.valid) {
    }
    else {
      console.log('form invalid');
    }
  }

 /*  async loadIntegrity() {
    const integrity = await this.fns.httpsCallable('getIntegrityKey')({}).toPromise();
    this.shoppingCart.patchValue({ integrity: integrity.integrity });
    this.test = integrity
    console.log(this.test);

  } */


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
    phoneCtrl: ['', [Validators.required]], // solo números
    legalIdTypeCtrl: ['', Validators.required],
    idCtrl: ['', []],
  });

  shoppingCart = this._formBuilder.group({
    totalPrice: [this.cartService.getTotalPrice() * 100, [Validators.required]],
    uniqueReference: [this.cartService.generateUniqueReference(), [Validators.required]],
    currency: ['COP',  [Validators.required]],
    publicKey: ['pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg', [Validators.required]],
    integrity: ['test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG']
  })

  formCheckout = this._formBuilder.group({
    personalDetails: this.firstFormGroup,
    addressDetails: this.secondFormGroup,
    shoppingCart: this.shoppingCart,
  });

  submitToWompi(form: HTMLFormElement) {
    if (this.formCheckout.valid) {
      // Limpia cualquier campo previo
      while (form.firstChild) {
        form.removeChild(form.firstChild);
      }

      // Añade los campos requeridos
      this.addHiddenInput(form, 'public-key', this.shoppingCart.get('publicKey')?.value ?? '');
      this.addHiddenInput(form, 'currency', this.shoppingCart.get('currency')?.value ?? '');
      this.addHiddenInput(form, 'amount-in-cents', this.shoppingCart.get('totalPrice')?.value?.toString() ?? ''); // Convierte a string si es número
      this.addHiddenInput(form, 'reference', this.shoppingCart.get('uniqueReference')?.value ?? '');
      this.addHiddenInput(form, 'signature:integrity', this.shoppingCart.get('integrity')?.value ?? '');

      // Añade datos opcionales
      this.addHiddenInput(form, 'redirect-url', 'https://mi-sitio.com/resultado');
      this.addHiddenInput(form, 'customer-data:email', this.firstFormGroup.get('mailCtrl')?.value ?? '');
      this.addHiddenInput(form, 'customer-data:full-name', this.firstFormGroup.get('nameCtrl')?.value ?? '');
      this.addHiddenInput(form, 'customer-data:phone-number', this.firstFormGroup.get('phoneCtrl')?.value ?? '');
      this.addHiddenInput(form, 'customer-data:legal-id', this.firstFormGroup.get('idCtrl')?.value ?? '');
      this.addHiddenInput(form, 'customer-data:legal-id-type', this.firstFormGroup.get('legalIdTypeCtrl')?.value ?? '');

      this.addHiddenInput(form, 'shipping-address:address-line-1', this.secondFormGroup.get('address')?.value ?? '');
      this.addHiddenInput(form, 'shipping-address:city', this.secondFormGroup.get('municipio')?.value ?? '');
      this.addHiddenInput(form, 'shipping-address:region', this.secondFormGroup.get('departamento')?.value ?? '');
      this.addHiddenInput(form, 'shipping-address:country', 'CO');
      this.addHiddenInput(form, 'shipping-address:phone-number', this.firstFormGroup.get('phoneCtrl')?.value ?? '');

      // Envía el formulario
      form.submit();
    } else {
      console.log('Formulario no válido');
    }
  }

  private addHiddenInput(form: HTMLFormElement, name: string, value: string | null) {
    if (value !== null) { // Verifica que el valor no sea null antes de crear el input
      const input = this.renderer.createElement('input');
      this.renderer.setAttribute(input, 'type', 'hidden');
      this.renderer.setAttribute(input, 'name', name);
      this.renderer.setAttribute(input, 'value', value);
      this.renderer.appendChild(form, input);
    }
  }

}
