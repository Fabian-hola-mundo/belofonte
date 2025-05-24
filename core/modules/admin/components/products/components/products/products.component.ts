import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ProductsService } from '../../../../../../services/products.service';
import { SeeProductComponent } from '../see-product/see-product.component';
import { Product } from '../../../../interface/products';
import { SidebarService } from '../../../../services/sidebar.service';
import { CreateProductComponent } from '../../create.product/create.product.component';
import { Router, RouterModule } from '@angular/router';

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
    RouterModule,
    CreateProductComponent,
    ...MAT,
    ...CRUD
],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  host: {'ngSkipHydration': 'true'}
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
  stepperIndex = -1

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
          id: '',
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
    this.router.navigate(['admin/products', row.slug]);
  }

  // Control de botones para creación de form inicio

  onStepperIndexChange(index: number) {
    this.stepperIndex = index; // Update the stepperIndex whenever the child component emits the event
    // This method will be called whenever the stepperIndexChange event is emitted from the child component.
    // Update the UI to reflect the current step if needed
  }

  onSubmit(formData: FormGroup) {
    // Handle form submission from here (send to backend, etc.)
  }

  goBack(createProductComponent: CreateProductComponent) {
    createProductComponent.previousStep();
  }

  goForward(createProductComponent: CreateProductComponent) {
    createProductComponent.nextStep();
  }

  // Cierre control de botones para creación de form inicio

  constructor(
    private router: Router,
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
