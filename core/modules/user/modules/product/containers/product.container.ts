import { Component, Pipe } from '@angular/core';
import { ProductNavComponent } from '../components/nav/product.nav.component';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { ProductsService } from '../../../../../services/products.service';
import { InventoryItem, Product } from '../../../../admin/interface/products';
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
    <bel-product-description
      [subRefSelected]="subRefSelected"
      [colors]="colors"
      [allSubRef]="allSubRef"
      [data]="selectedProduct"
      (newRef)="getNewRefSelected($event)"
    />
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
  colors: any[] = [];
  allSubRef : InventoryItem [] = []
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
            quantity: 0,
          },
        ],
        images: [
          {
            url: '',
            alt: '',
          },
        ],
        color: {
          name: '',
          hexa: '',
        },
        count: 0,
      },
    ],
    control: {
      ref: '0',
      totalStock: 0,
    },
  };
  images = this.selectedProduct.inventory[0].images;

  subRefSelected: InventoryItem = {
    subRef: '',
    stock: [
      {
        size: '',
        quantity: 0,
      },
    ],
    images: [
      {
        url: '',
        alt: '',
      },
    ],
    color: {
      name: '',
      hexa: '',
    },
    count: 0,
  };

  getNewRefSelected(newRef: InventoryItem) {
    this.subRefSelected = newRef
    this.images = newRef.images
  }

  constructor(
    private productService: ProductsService,
    private selectedProductService: SelectedProductService,
    private activeRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.activeRoute.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.loadData();
    });
  }

  async getSubRef() {
    this.subRefSelected = this.selectedProduct.inventory[0]
  }



  extractAllSubRef() {
    this.selectedProduct.inventory.forEach((subRef) => {
      if (this.allSubRef) {
        this.allSubRef.push(subRef)
      }
    });
    console.log(this.allSubRef);
  }

  async loadData(): Promise<void> {
    this.dataFromCollection = await this.productService.getDataFromCollection(
      'products'
    );
    this.getActiveData();
    this.assignImages();
    this.getSubRef()
    this.extractAllSubRef()
    this.extractColors()
    window.scroll(0, 0);
  }

  assignImages() {
    if (
      this.selectedProduct.inventory &&
      this.selectedProduct.inventory.length > 0
    ) {
      this.images = this.selectedProduct.inventory[0].images;
    } else {
      // Handle the case where inventory is undefined or empty
      this.images = [];
    }
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

  extractColors() {
    this.allSubRef.forEach((color) => {
      this.colors.push(color.color);
    });
    console.log(this.colors);
  }
}
