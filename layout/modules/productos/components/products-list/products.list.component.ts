import { Component, Input, input } from '@angular/core';
import { ProductCardComponent, producInterface } from './product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'bel-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, MatRippleModule, RouterModule],
  templateUrl: './products.list.component.html',
  styleUrl: './products.list.component.scss'
})
export class ProductsListComponent {

  products: producInterface[] = []
  groupedProducts: producInterface[][] = []

  constructor(){
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
      this.products = json;
      this.groupedProducts = this.groupProducts(4);
      console.log(this.groupedProducts);
    });
  }

  private groupProducts(groupSize: number): producInterface[][] {
    const groupedProducts: producInterface[][] = [];
    for (let i = 0; i < this.products.length; i += groupSize) {
      groupedProducts.push(this.products.slice(i, i + groupSize));
    }
    return groupedProducts;
  }

}
