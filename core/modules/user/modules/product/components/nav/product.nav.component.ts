import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "bel-product-nav",
  standalone: true,
  templateUrl: './product.nav.component.html',
  styleUrl: './product.nav.component.scss',
  imports: [MatIconModule, MatButtonModule]
})

export class ProductNavComponent {



}
