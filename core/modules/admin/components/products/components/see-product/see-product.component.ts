import { Component, Input, Pipe } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../interface/products';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../../../../services/products.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EditProductComponent } from '../../edit.product/edit.product.component';

const MATERIALMODULES = [
  MatChipsModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
];
@Component({
  selector: 'app-see-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ...MATERIALMODULES,
    EditProductComponent,
  ],
  templateUrl: './see-product.component.html',
  styleUrls: ['./see-product.component.scss'],
})
export class SeeProductComponent implements OnInit {
  slug!: any;
  dataFromCollection!: any;
  stepperIndex = 0;
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
          id: '',
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
  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.activeRoute.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.loadData();
    });
  }

  async deleteProduct() {
    if (!this.selectedProduct.id) {
      console.error('No se puede eliminar un producto sin ID');
      return;
    }

    const confirmation = confirm(
      `¿Estás seguro de que deseas eliminar el producto "${this.selectedProduct.title}"?`
    );
    if (!confirmation) return;

    try {
      await this.productService.deleteProduct(this.selectedProduct.id);
      alert('Producto eliminado con éxito');
      // Redirige al listado de productos o realiza otra acción
      this.router.navigate(['/admin/products']);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Ocurrió un error al eliminar el producto.');
    }
  }

  onStepperIndexChange(index: number) {
    this.stepperIndex = index;
  }

  goBack(createProductComponent: EditProductComponent) {
    createProductComponent.previousStep();
  }

  goForward(createProductComponent: EditProductComponent) {
    createProductComponent.nextStep();
  }

  async loadData(): Promise<void> {
    this.dataFromCollection = await this.productService.getDataFromCollection(
      'products'
    );
    this.getActiveData();
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
