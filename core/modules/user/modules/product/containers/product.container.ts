import { Component } from "@angular/core";
import { ProductNavComponent } from "../components/nav/product.nav.component";

@Component({
  selector: "bel-product-container",
  standalone: true,
  styles: `
  @import '../../../../../../src/styles.scss';
  :host {
    width: 100%;
    max-width: $maxWidth;
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
