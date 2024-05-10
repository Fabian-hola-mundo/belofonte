import { Component} from '@angular/core';
import { ProductsNavComponent } from '../../components/nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bel-products',
  standalone: true,
  styleUrl: './products.page.component.scss',
  imports: [
    ProductsNavComponent,
    RouterModule
  ],
  template: `
  <bel-product-nav></bel-product-nav>
  <router-outlet></router-outlet>
  `,
})
export class ProductsPageComponent{

}
