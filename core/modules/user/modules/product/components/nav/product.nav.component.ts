import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { DialogService } from "../../../../components/shopping-card/shopping-card-config";

@Component({
  selector: "bel-product-nav",
  standalone: true,
  templateUrl: './product.nav.component.html',
  styleUrl: './product.nav.component.scss',
  imports: [MatIconModule, MatButtonModule, RouterModule, CommonModule]
})

export class ProductNavComponent {

  @Input() title = ''
  @Input() isScrolledHalfway: boolean = false;

  constructor(private dialogService: DialogService) {}

  openDialog() {
    this.dialogService.openShoppingCardDialog();
  }

}
