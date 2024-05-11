import { Component} from '@angular/core';
import { NavCardComponent } from './nav-card/nav.card.component';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bel-product-nav',
  standalone: true,
  styleUrl: './nav.component.scss',
  imports: [
    NavCardComponent,
    CommonModule,
    MatRippleModule,
    RouterModule
  ],
  templateUrl: './nav.component.html'
})
export class ProductsNavComponent{

  public navCards = [
    {
      name: "Hombres",
      router: 'hombres'
    },
    {
      name: "Accesorios",
      router: 'accesorios'
    },
    {
      name: "Mujeres",
      router: 'mujeres'
    },
  ]

}
