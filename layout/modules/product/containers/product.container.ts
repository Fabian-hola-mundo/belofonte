import { Component } from "@angular/core";
import { ProductNavComponent } from "../components/nav/product.nav.component";

@Component({
  selector: "bel-product-container",
  standalone: true,
  styles: `
  :host {
    width: 100%
  }
  `,
  template: `
    <bel-product-nav/>
  `,
  imports: [
    ProductNavComponent
  ]
})

export class ProductContainer {
  constructor() {

  }
}
