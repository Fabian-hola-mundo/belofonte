import { Component, Pipe } from '@angular/core';
import { ProductNavComponent } from '../components/nav/product.nav.component';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { ProductsService } from '../../../../../services/products.service';
import { Product } from '../../../../admin/interface/products';
import { SelectedProductService } from '../../../services/selected-product.service';
import { ProductDescriptionComponent } from '../components/description/product.description.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { url } from 'inspector';

@Component({
  selector: 'bel-product-container',
  standalone: true,
  styles: `
  @import '../../../../../../src/styles.scss';
  :host {
    width: 100%;
    max-width: $maxWidth;
  }
  `,
  template: `
    <bel-product-nav />
    <bel-product-carousel [images]="images" />
    <bel-product-description [data]="selectedProduct" />
  `,
  imports: [
    ProductNavComponent,
    CarouselComponent,
    CommonModule,
    ProductDescriptionComponent,
  ],
})
export class ProductContainer {
  slug!: any;
  dataFromCollection!: any;
  selectedProduct: Product = {
    id: '',
    category: [''],
    subcategory: [''],
    slug: '',
    title: '',
    description: '',
    price: 0,
    characteristics: {
      height: 0,
      weight: 0,
    },
    inventory: [
      {
        subRef: '',
        stock: [
          {
            size: '',
            quantity: 0
          }
        ],
        images: [
          {
            url: '',
            alt: ''
          }
        ],
        color: {
          name: '',
          hexa: ''
        },
        count: 0
      }
    ],
    control: {
      ref: '0',
      totalStock: 0,
    },
  };
  images = this.selectedProduct.inventory[0].images


  constructor(
    private productService: ProductsService,
    private selectedProductService: SelectedProductService,
    private activeRoute: ActivatedRoute
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.activeRoute.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.loadData();
    });
    this.selectedProduct = this.selectedProductService.getSelectedProduct();
    this.images = this.selectedProduct.inventory[0].images
  }

  async loadData(): Promise<void> {
    this.dataFromCollection = await this.productService.getDataFromCollection(
      'products'
    );
    this.getActiveData();
    window.scroll(0, 0);
  }

  getActiveData(): void {
    if (this.slug) {
      const foundProduct = this.dataFromCollection.find(
        (content: Product) => content.slug === this.slug
      );
      if (foundProduct) {
        this.selectedProduct = foundProduct;
      } else {
      }
    }
  }
}
