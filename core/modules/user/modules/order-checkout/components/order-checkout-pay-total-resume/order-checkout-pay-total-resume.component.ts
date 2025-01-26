import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'bel-order-checkout-pay-total-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-checkout-pay-total-resume.component.html',
  styleUrl: './order-checkout-pay-total-resume.component.scss'
})
export class OrderCheckoutPayTotalResumeComponent {

  constructor(
    public cartService: CartService,
  ){

  }

}
