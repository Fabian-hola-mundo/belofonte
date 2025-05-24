import { Component, Input, OnInit, input } from '@angular/core';
import { ProductCardComponent, producInterface } from './product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../../../../services/products.service';
import { Product } from '../../../../../admin/interface/products';
import { SelectedProductService } from '../../../../services/selected-product.service';
import { SkeletonService } from '../../../../../../services/skeleton.service';
import { FiltersService } from '../../services/filters.service';


@Component({
  selector: 'bel-product-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, MatRippleModule, RouterModule],
  templateUrl: './products.list.component.html',
  styleUrl: './products.list.component.scss'
})
export class ProductsListComponent implements OnInit {
  isLoading =  true
  data: any;
  filteredProducts: Product[] = [];
  products: Product[] = []
  groupedProducts: Product[][] = []

  constructor(
    private productService: ProductsService,
    private selectedProductService: SelectedProductService,
    private router: Router,
    public skeletonService: SkeletonService,
    private filterService: FiltersService
  ){

  }

  openProduct(product: Product){
    this.selectedProductService.setSelectedProduct(product)
    this.router.navigate(['/producto', product.slug])

  }

  async ngOnInit(): Promise<void> {
    this.products = await this.productService.getDataFromCollection('products');
    this.filterService.selectedCategory$.subscribe((category) => {
      if (category === 'Todos') {
        // Si la categoría es "Todos", muestra todos los productos
        this.filteredProducts = [...this.products];
      } else {
        // Filtra los productos por la categoría seleccionada
        this.filteredProducts = this.products.filter((product) =>
          product.category.includes(category)
        );
      }
      this.groupedProducts = this.groupProducts(4);
    });

    this.isLoading = true;
    this.skeletonService.getData().subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (err) => {
        console.error('Error al obtener datos del SkeletonService', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  private groupProducts(groupSize: number): Product[][] {
    const groupedProducts: Product[][] = [];
    for (let i = 0; i < this.filteredProducts.length; i += groupSize) {
      groupedProducts.push(this.filteredProducts.slice(i, i + groupSize));
    }
    return groupedProducts;
  }

}
