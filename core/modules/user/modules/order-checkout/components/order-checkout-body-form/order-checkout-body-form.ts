import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OrderCheckoutBodyFormStep1Component } from './steps/order-checkout-body-form-step-1';
import { OrderCheckoutBodyFormStep2Component } from './steps/order-checkout-body-form-step-2';
import { OrderCheckoutBodyFormStep3WompiComponent } from './steps/order-checkout-body-form-step-3-wompi';
import { CartService } from '../../../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';

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
  integrity = ''

  private renderer = inject(Renderer2);
  test = '';
  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService
  ) /* private fns: AngularFireFunctions */
  {
    /* this.loadIntegrity() */
  }


/*   async ngOnInit() {
    // Generar referencia única y actualizar el campo en el formulario de checkout
    const uniqueReference = this.cartService.generateUniqueReference();
    this.shoppingCart.patchValue({
      uniqueReference
    });

    // Suscribirse a los cambios en mailCtrl y recalcular el hash de integridad
    this.firstFormGroup.get('mailCtrl')?.valueChanges.subscribe(async (email) => {
      if (email && this.firstFormGroup.get('mailCtrl')?.valid) { // Verifica que el correo sea válido
        const integrityHash = await this.checkoutService.generateIntegrityHash(email, uniqueReference);
        this.integrity = integrityHash;
        this.shoppingCart.patchValue({
          integrity: integrityHash,
          uniqueReference: uniqueReference
        });
        console.log('Hash de integridad generado:', integrityHash);
        console.log('referencia única:', uniqueReference);
      }
    });
  } */

    async ngOnInit() {
      // Valores estáticos de prueba
      const staticReference = 'sk8-438k4-xmxm392-sn2m';
      const staticAmountInCents = 21108400; // Ejemplo: 1184.00 COP
      const staticCurrency = 'COP';
      const staticExpirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Expira en 15 minutos
      const staticEmail = 'customer@example.com';

      // Actualizar el formulario `shoppingCart` con los datos estáticos
      this.shoppingCart.patchValue({
        uniqueReference: staticReference,
        totalPrice: staticAmountInCents,
        currency: staticCurrency,
        integrity: '' // Dejaremos el campo vacío por ahora
      });

      // Generar el hash de integridad utilizando los datos estáticos
      const integrityHash = await this.checkoutService.generateIntegrityHash(staticReference, staticAmountInCents, staticCurrency, staticExpirationTime);

      // Actualizar el campo `integrity` en el formulario `shoppingCart`
      this.shoppingCart.patchValue({
        integrity: 'sk8-438k4-xmxm392-sn2m21108400COP2024-10-30T05:24:17.910Ztest_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG'
      });

      console.log('Datos de prueba enviados (sin variaciones):');
      console.log({
        reference: staticReference,
        amount_in_cents: staticAmountInCents,
        currency: staticCurrency,
        expiration_time: staticExpirationTime,
        customer_email: staticEmail,
        integrity_hash: integrityHash
      });
    }


  nextStep() {
    this.stepper.next();
  }
  prevStep() {
    this.stepper.previous();
  }

  goToPay() {
    if (this.formCheckout.valid) {
    } else {
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
    postalCode: ['', []], // Nuevo campo para código postal
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
    uniqueReference: [''],
    currency: ['COP', [Validators.required]],
    publicKey: [
      'pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg',
      [Validators.required],
    ],
    integrity: [''],
  });

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
      this.addHiddenInput(
        form,
        'public-key',
        this.shoppingCart.get('publicKey')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'currency',
        this.shoppingCart.get('currency')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'amount-in-cents',
        this.shoppingCart.get('totalPrice')?.value?.toString() ?? ''
      ); // Convierte a string si es número
      this.addHiddenInput(
        form,
        'reference',
        this.shoppingCart.get('uniqueReference')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'signature:integrity',
        this.shoppingCart.get('integrity')?.value ?? ''
      );

      // Añade datos opcionales
      this.addHiddenInput(
        form,
        'redirect-url',
        'https://mi-sitio.com/resultado'
      );
      this.addHiddenInput(
        form,
        'customer-data:email',
        this.firstFormGroup.get('mailCtrl')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'customer-data:full-name',
        this.firstFormGroup.get('nameCtrl')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'customer-data:phone-number',
        this.firstFormGroup.get('phoneCtrl')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'customer-data:legal-id',
        this.firstFormGroup.get('idCtrl')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'customer-data:legal-id-type',
        this.firstFormGroup.get('legalIdTypeCtrl')?.value ?? ''
      );

      this.addHiddenInput(
        form,
        'shipping-address:address-line-1',
        this.secondFormGroup.get('address')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'shipping-address:city',
        this.secondFormGroup.get('municipio')?.value ?? ''
      );
      this.addHiddenInput(
        form,
        'shipping-address:region',
        this.secondFormGroup.get('departamento')?.value ?? ''
      );
      this.addHiddenInput(form, 'shipping-address:country', 'CO');
      this.addHiddenInput(
        form,
        'shipping-address:phone-number',
        this.firstFormGroup.get('phoneCtrl')?.value ?? ''
      );

      // Envía el formulario

      console.log({
        publicKey: this.shoppingCart.get('publicKey')?.value,
        currency: this.shoppingCart.get('currency')?.value,
        amountInCents: this.shoppingCart.get('totalPrice')?.value?.toString(),
        reference: this.shoppingCart.get('uniqueReference')?.value,
        signature: this.shoppingCart.get('integrity')?.value,
        customerEmail: this.firstFormGroup.get('mailCtrl')?.value,
        customerFullName: this.firstFormGroup.get('nameCtrl')?.value,
        customerPhoneNumber: this.firstFormGroup.get('phoneCtrl')?.value,
        customerLegalId: this.firstFormGroup.get('idCtrl')?.value,
        customerLegalIdType: this.firstFormGroup.get('legalIdTypeCtrl')?.value,
        addressLine1: this.secondFormGroup.get('address')?.value,
        city: this.secondFormGroup.get('municipio')?.value,
        region: this.secondFormGroup.get('departamento')?.value,
        country: 'CO',
      });

      form.submit();
    } else {
      console.log('Formulario no válido');
    }
  }

  private addHiddenInput(
    form: HTMLFormElement,
    name: string,
    value: string | null
  ) {
    if (value !== null) {
      // Verifica que el valor no sea null antes de crear el input
      const input = this.renderer.createElement('input');
      this.renderer.setAttribute(input, 'type', 'hidden');
      this.renderer.setAttribute(input, 'name', name);
      this.renderer.setAttribute(input, 'value', value);
      this.renderer.appendChild(form, input);
    }
  }
}
