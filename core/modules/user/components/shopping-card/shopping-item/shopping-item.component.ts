import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {  CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartItem } from '../../../interface/cart.interface';

@Component({
  selector: 'bel-shopping-item',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './shopping-item.component.html',
  styleUrl: './shopping-item.component.scss'
})
export class ShoppingItemComponent {
  @Input() item!: CartItem; // El ítem se recibe como entrada
  isImageLoaded = false;
  constructor(private cartService: CartService,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

  }

  deleteItem() {
    const deletedItem = this.cartService.deleteItem(this.item.uniqueId || ''); // Elimina y guarda el ítem eliminado

    if (deletedItem) { // Si hay un ítem eliminado
      const snackBarRef = this._snackBar.open('Item eliminado', 'Deshacer', {
        duration: 4000,
        horizontalPosition: 'end',
      });

      snackBarRef.onAction().subscribe(() => {
        this.cartService.addToCart(deletedItem); // Restaura el ítem si se hace clic en "Deshacer"
        this._snackBar.open('Eliminación deshecha', '', { duration: 2000, horizontalPosition: 'end', });
      });
    }
  }

  onImageLoad() {
    this.isImageLoaded = true;
  }

  viewItem() {
    this.router.navigate([`/producto/${this.item.slug}`]);
    this.dialog.closeAll()
  }

}
