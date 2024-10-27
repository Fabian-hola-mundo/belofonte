import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartItem, CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'bel-shopping-item',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './shopping-item.component.html',
  styleUrl: './shopping-item.component.scss'
})
export class ShoppingItemComponent {
  @Input() item!: CartItem; // El ítem se recibe como entrada

  constructor(private cartService: CartService,
    private router: Router,
    private dialog: MatDialog
  ) {

  }

  deleteItem() {
    this.cartService.deleteItem(this.item.uniqueId || '') ; // Usar uniqueId para eliminar
  }

  viewItem() {
    this.router.navigate([`/producto/${this.item.slug}`]);
    this.dialog.closeAll()
  }

}
