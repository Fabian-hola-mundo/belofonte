import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemsAddedComponent } from "../../../../components/shopping-card/items-added/items.added.component";
import { MatStepper } from '@angular/material/stepper';
import { OrderCheckoutBodyFormComponent } from '../order-checkout-body-form/order-checkout-body-form';
import { CartService } from '../../../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'bel-resumen',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule, ItemsAddedComponent],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss',
})
export class ResumenComponent {
  readonly panelOpenState = signal(false);

  @Input() orderCheckoutBodyForm!: OrderCheckoutBodyFormComponent;

  constructor(public cartService: CartService, private checkoutService: CheckoutService) {

  }

  continuar() {
    this.orderCheckoutBodyForm.nextStep();  // Ahora puedes llamar a `nextStep` desde `OrderCheckoutBodyFormComponent`
  }
  atras() {
    this.orderCheckoutBodyForm.prevStep();  // Ahora puedes llamar a `nextStep` desde `OrderCheckoutBodyFormComponent`
  }

  startCheckout() {
    this.checkoutService.initiatePayment().subscribe(
      (response: any) => {
        console.log('Payment initiated:', response);
        // Manejar redireccionamiento o mostrar estado de pago
      },
      (error: any) => {
        console.error('Error en el pago:', error);
      }
    );
  }
}
