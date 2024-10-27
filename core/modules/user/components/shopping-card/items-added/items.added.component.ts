import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingItemComponent } from "../shopping-item/shopping-item.component";
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../../services/cart.service';

@Component({
  selector: 'bel-items-added',
  standalone: true,
  template: `
    <div *ngFor="let item of cartItems">
      <bel-shopping-item [item]="item"></bel-shopping-item>
    </div>
  `,
  styles: `

  `,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, ShoppingItemComponent],
})
export class ItemsAddedComponent {

  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Suscribirse a los datos del carrito
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }



}
