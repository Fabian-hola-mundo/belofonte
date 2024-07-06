import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SeeProductComponent } from './see-product/see-product.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../../interface/products';
import { ProductsService } from '../../../../../services/products.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CreateProductComponent } from '../create.product/create.product.component';

const MAT = [
  MatRadioModule,
  MatDividerModule,
  MatMenuModule,
  MatChipsModule,
  MatCheckboxModule,
  MatIconModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatSidenavModule,
];

const CRUD = [
  CreateProductComponent
]

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatRippleModule,
    SeeProductComponent,
    CreateProductComponent,
    ...MAT,
    ...CRUD
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  host: {'ngSkipHydration': ''}
})
export class ProductsComponent {
  products: any | Product[] = [];
  testProducts!: any;
  dataSource: any;
  clickedRows = new Set<Product>();
  headerText = 'Test Title';
  mode = new FormControl('over' as MatDrawerMode);
  hasBackdrop = new FormControl(true as null | boolean);
  position = new FormControl('end' as 'start' | 'end');

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

  selectedProductSide: boolean = false;
  createdProductSide: boolean = false;
  dataLoaded = false;
  clearSidebar = this.sidebarService.clearSides();

  clearSides() {
    this.selectedProductSide = false;
    this.createdProductSide = false;
  }

  setProductOnRow(row: Product) {
    this.selectedProduct = row;
    this.selectedProductSide = true;
  }

  constructor(
    private productsService: ProductsService,
    private sidebarService: SidebarService
  ) {}

  async ngOnInit() {
    this.testProducts = await this.productsService.getDataFromCollection(
      'products'
    );
    this.dataLoaded = true
  }

  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'price',
    'category',
  ];
}
