import { Component, Input, OnInit, input } from '@angular/core';
import { ProductCardComponent, producInterface } from './product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../../../../services/products.service';
import { Product } from '../../../../../admin/interface/products';
import { SelectedProductService } from '../../../../services/selected-product.service';


@Component({
  selector: 'bel-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, MatRippleModule, RouterModule],
  templateUrl: './products.list.component.html',
  styleUrl: './products.list.component.scss'
})
export class ProductsListComponent implements OnInit {

  products: Product[] = []
  groupedProducts: Product[][] = []

  constructor(
    private productService: ProductsService,
    private selectedProductService: SelectedProductService,
    private router: Router
  ){

  }

  openProduct(product: Product){
    this.selectedProductService.setSelectedProduct(product)
    console.log(product.slug);
    this.router.navigate(['/producto', product.slug])

  }

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getDataFromCollection('products')
    this.groupedProducts = this.groupProducts(4)
  }


  private groupProducts(groupSize: number): Product[][] {
    const groupedProducts: Product[][] = [];
    for (let i = 0; i < this.products.length; i += groupSize) {
      groupedProducts.push(this.products.slice(i, i + groupSize));
    }
    return groupedProducts;
  }

}
