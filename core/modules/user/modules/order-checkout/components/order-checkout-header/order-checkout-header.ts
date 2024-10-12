import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductNavComponent } from "../../../product/components/nav/product.nav.component";

@Component({
  selector: 'bel-order-checkout-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule, ProductNavComponent],
  templateUrl: './order-checkout-header.html',
  styleUrl: './order-checkout-header.scss',
})
export class OrderCheckoutHeaderComponent {
  readonly panelOpenState = signal(false);
}
