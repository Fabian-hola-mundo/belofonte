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
import { OrderCheckoutBodyFormStepResume } from './steps/order-checkout-body-form-step-3-wompi';
import { CartService } from '../../../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { OrderCheckoutActionsComponent } from '../order-checkout-actions/order-checkout-actions.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { OrderService } from '../../services/order.service';
import { PaymentData } from '../../interfaces/order.interface';

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
    OrderCheckoutBodyFormStepResume,
    OrderCheckoutActionsComponent,
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
  integrity = '';
  isMobile = true;

  private renderer = inject(Renderer2);
  test = '';
  constructor(
    private cartService: CartService,
    private breakpointObserver: BreakpointObserver,
    private checkoutService: CheckoutService,
    private orderService: OrderService
  ) {}

  async generateIntegrityHash(
    reference: string,
    amount: number,
    currency: string,
    expiration: string
  ): Promise<string> {
    const integrityKey = 'test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG';

    try {
      // Concatenar los datos en el orden esperado
      const concatenatedString = `${reference}${amount}${currency}${expiration}${integrityKey}`;

      // Codificar la cadena
      const encodedText = new TextEncoder().encode(concatenatedString);

      // Generar el hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);

      // Convertir el hash a formato hexadecimal
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return hashHex; // Retornar el hash como string
    } catch (error) {
      console.error('Error generando el hash de integridad:', error);
      throw error; // Asegurar que errores no queden sin manejar
    }
  }

  async ngOnInit() {
    // En lugar de la referencia estática, obtenemos la que se guarda en localStorage
    // Valores estáticos de prueba
    const staticCurrency = 'COP';
    const { reference, expiration } = this.checkoutService.getReferenceData();

    const dynamicTotalPrice = this.cartService.getTotalPrice() * 100;
    const expirationTimeISO = expiration.toISOString();
    const staticEmail = 'customer@example.com';
    const publicKey = 'pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg';

    // Actualizar el formulario `shoppingCart` con los datos estáticos

    const integrityHash = await this.generateIntegrityHash(
      reference,
      dynamicTotalPrice,
      staticCurrency,
      expirationTimeISO
    );

    this.shoppingCart.patchValue({
      uniqueReference: reference,
      totalPrice: dynamicTotalPrice,
      currency: staticCurrency,
      expiration: expirationTimeISO,
      publicKey: publicKey,
      integrity: integrityHash,
    });

    this.breakpointObserver
      .observe(['(max-width: 1007px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
          // Lógica para pantallas mayores a 1007px
        }
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
    }
  }

  firstFormGroup = this._formBuilder.group({
    mailCtrl: ['', [Validators.required, Validators.email]],
    nameCtrl: ['', [Validators.required]],
    phoneCtrl: ['', [Validators.required]], // solo números
    legalIdTypeCtrl: ['', [Validators.required]],
    idCtrl: ['', []],
  });

  secondFormGroup = this._formBuilder.group({
    address: ['', [Validators.required]],
    aditiionalAddress: ['', []],
    departamento: ['', [Validators.required]],
    municipio: [{ value: '', disabled: true }, [Validators.required]], // Municipio está deshabilitado inicialmente
    postalCode: ['', []], // Nuevo campo para código postal
  });

  shoppingCart = this._formBuilder.group({
    uniqueReference: [''],
    totalPrice: [this.cartService.getTotalPrice() * 100, []],
    currency: ['', []],
    expiration: [''],
    integrity: [''],
    publicKey: ['', []],
  });

  formCheckout = this._formBuilder.group({
    personalDetails: this.firstFormGroup,
    addressDetails: this.secondFormGroup,
    shoppingCart: this.shoppingCart,
  });

  async submitToWompi(form: HTMLFormElement) {
    if (this.formCheckout.valid) {
      try {
        // Crear el pedido en Firestore antes de enviar a Wompi
        const customerData = {
          email: this.firstFormGroup.get('mailCtrl')?.value || '',
          fullName: this.firstFormGroup.get('nameCtrl')?.value || '',
          phoneNumber: this.firstFormGroup.get('phoneCtrl')?.value || '',
          legalId: this.firstFormGroup.get('idCtrl')?.value || '',
          legalIdType: this.firstFormGroup.get('legalIdTypeCtrl')?.value || ''
        };

        const shippingAddress = {
          addressLine1: this.secondFormGroup.get('address')?.value || '',
          city: this.secondFormGroup.get('municipio')?.value || '',
          region: this.secondFormGroup.get('departamento')?.value || '',
          country: 'CO',
          postalCode: this.secondFormGroup.get('postalCode')?.value || '',
          additionalInfo: this.secondFormGroup.get('aditiionalAddress')?.value || ''
        };

        const paymentData: PaymentData = {
          reference: this.shoppingCart.get('uniqueReference')?.value || '',
          amount: this.shoppingCart.get('totalPrice')?.value || 0,
          currency: this.shoppingCart.get('currency')?.value || '',
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Crear el pedido en Firestore
        const orderId = await this.orderService.createOrder(
          customerData,
          shippingAddress,
          paymentData
        );

        // Limpia cualquier campo previo
        while (form.firstChild) {
          form.removeChild(form.firstChild);
        }

        // Añade los campos requeridos
        this.addHiddenInput(form, 'reference', this.shoppingCart.get('uniqueReference')?.value ?? '');
        this.addHiddenInput(form, 'redirect-url', `${window.location.origin}/payment-result/${orderId}`);
        this.addHiddenInput(form, 'amount-in-cents', this.shoppingCart.get('totalPrice')?.value?.toString() ?? '');
        this.addHiddenInput(form, 'currency', this.shoppingCart.get('currency')?.value ?? '');
        this.addHiddenInput(form, 'expiration-time', this.shoppingCart.get('expiration')?.value ?? '');
        this.addHiddenInput(form, 'signature:integrity', this.shoppingCart.get('integrity')?.value ?? '');
        this.addHiddenInput(form, 'public-key', this.shoppingCart.get('publicKey')?.value ?? '');

        // Añade datos opcionales
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

        // Guardar el ID del pedido en localStorage para usarlo en la página de resultado
        localStorage.setItem('currentOrderId', orderId);

        form.submit();
      } catch (error) {
        console.error('Error al crear el pedido:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } else {
      // Recorre los formularios hijos y muestra sus errores
      Object.keys(this.formCheckout.controls).forEach((key) => {
        const control = this.formCheckout.get(key);
        if (control && control.invalid) {
          // Manejar errores de validación
        }
      });
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
