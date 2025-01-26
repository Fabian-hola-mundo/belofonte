import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DeliveryOptions } from './delivery.options.constant';
import { DeliveryOption } from './delivery.options.interface';
import { MatRippleModule } from '@angular/material/core';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'bel-oder-checkout-pay-metod',
  standalone: true,
  imports: [CommonModule, MatRippleModule],
  templateUrl: './order-checkout-pay-metod.component.html',
  styleUrl: './order-checkout-pay-metod.component.scss',
})
export class OderCheckoutPayMetodComponent {
  deliveryOptions: DeliveryOption[] = DeliveryOptions;
  selectedOption: DeliveryOption | null = null;
  freeShipping: boolean = false;

  onOptionClick(option: DeliveryOption): void {
    this.selectedOption = option; // Establece la opción seleccionada
  }

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.freeShipping$.subscribe(
      (status) => (this.freeShipping = status)
    );
  }
}
