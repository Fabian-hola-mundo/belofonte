import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ShoppingItemComponent } from './shopping-item/shopping-item.component';
import { MatIconModule } from '@angular/material/icon';
import { ItemsAddedComponent } from './items-added/items.added.component';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bel-shopping-card',
  standalone: true,
  styleUrl: './shopping-card.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ShoppingItemComponent,
    MatIconModule,
    CommonModule,
    RouterModule,
    ItemsAddedComponent,
  ],
  templateUrl: './shopping-card.html',
})
export class ShoppingCardComponent {

  constructor(public cartService: CartService) {

  }

}
