import { Component } from '@angular/core';
import { CardColor, CardServices } from '../../models/card.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../../../services/products.service';
import { FiltersService } from '../../../productos/services/filters.service';

@Component({
  selector: 'bel-above-the-fold',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule, RouterModule],
  templateUrl: './above.the.fold.component.html',
  styleUrl: './above.scss',
})
export class AboveTheFoldComponent {


  constructor(
    productService: ProductsService,
    public _showFilters: FiltersService,
  ){
    this._showFilters.setInProducts(false); // Establece el valor inicial
  }

  cardServices: CardServices[] = [
    {
      title: 'Hombres',
      image: 'assets/landing/manInit-min.png',
      color: {
        baseColor: 'var(--md-sys-color-on-secondary-container)',
        onBase: 'var(--md-sys-color-on-secondary)',
      },
    },
    {
      title: 'Accesorios',
      image: 'assets/landing/accesory-min.png',
      color: {
        baseColor: 'var(--md-sys-color-on-primary-container)',
        onBase: 'var(--md-sys-color-on-primary)',
      },
    },
    {
      title: 'Mujeres',
      image: 'assets/landing/womenInit-min.png',
      color: {
        baseColor: 'var(--md-sys-color-on-tertiary-container)',
        onBase: 'var(--md-sys-color-on-tertiary)',
      },
    },
  ];
}
