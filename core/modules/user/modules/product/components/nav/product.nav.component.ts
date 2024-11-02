import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { DialogService } from "../../../../components/shopping-card/shopping-card-config";
import { CartService } from "../../../../services/cart.service";
import { MatBadgeModule } from "@angular/material/badge";

@Component({
  selector: "bel-product-nav",
  standalone: true,
  templateUrl: './product.nav.component.html',
  styleUrl: './product.nav.component.scss',
  imports: [MatIconModule, MatButtonModule, RouterModule, CommonModule, MatBadgeModule]
})

export class ProductNavComponent {
  totalItems: number = 0;
  @Input() title = ''
  @Input() isScrolledHalfway: boolean = false;

  constructor(private dialogService: DialogService,
    private cartService: CartService
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.totalItems = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  openDialog() {
    this.dialogService.openShoppingCardDialog();
  }

}
