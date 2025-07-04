import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  InventoryItem,
  Product,
} from '../../../../../admin/interface/products';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { Color } from '../../../../../admin/interface/color';
import { CartService } from '../../../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogService } from '../../../../components/shopping-card/shopping-card-config';

@Component({
  selector: 'bel-product-description',
  templateUrl: './product.description.component.html',
  styleUrls: ['./product.description.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    CommonModule,
  ],
})
export class ProductDescriptionComponent implements OnInit {
  @Input() data: Product = {
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

  @Input() subRefSelected: InventoryItem = {
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
  };

  @Input() allSubRef!: InventoryItem[];
  @Input() colors: any[] = [];
  @Output() newRef = new EventEmitter();
  firstColor: {} = {};
  fistSubref!: InventoryItem;
  selectedProduct = {};
  availableSizes: any[] = [];
  selectedColor: any = this.colors[1]; // Color inicial seleccionado


  constructor(
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['colors'] && changes['colors'].currentValue?.length > 0 && !this.selectedColor) {
      // Inicializa el color seleccionado al primero si no está definido
      this.selectedColor = changes['colors'].currentValue[0];
    }
  }

  changeProductRef(color: Color) {
    this.selectedColor = color; // Actualiza el color seleccionado
    this.allSubRef.forEach((newSubRef) => {
      if (color.hexa === newSubRef.color?.hexa) {
        this.newRef.emit(newSubRef);
      }
    });
  }


  addToCart() {
    this.cartService.addToCart({
      id: this.data.id,
      name: this.data.title,
      image: this.subRefSelected.images?.[0].url,
      slug: this.data.slug,
      uniqueId:
        `${this.data.id}-${this.subRefSelected.stock?.[0]?.size}-${this.subRefSelected.color?.hexa}` ||
        '',
      price: this.data.price,
      size: this.subRefSelected.stock?.[0]?.size || '', // Toma el tamaño seleccionado
      color: this.subRefSelected.color?.hexa || '', // Toma el color seleccionado
      quantity: 1, // Cantidad predeterminada (1)
    });
    this.openSnackBar();
  }

  openSnackBar() {
    const snackBarRef = this._snackBar.open('Producto Añadido', 'Ver Carrito', {
      duration: 4000,
      horizontalPosition: 'end',
    });
    snackBarRef.onAction().subscribe(() => {
        this.dialogService.openShoppingCardDialog();
    })
  }
}
