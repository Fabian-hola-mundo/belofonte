import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
      name: '',
      hexa: '',
    },
    count: 0,
  };

  @Input() allSubRef!: InventoryItem[];
  @Input() colors: any[] = [];
  @Output() newRef = new EventEmitter();
  firstColor: {} = {};

  // llamar al primer subRef

  fistSubref!: InventoryItem;

  selectedProduct = {};
  availableSizes: any[] = [];

  ngOnInit() {
  }

  changeProductRef(color: Color) {
    this.allSubRef.forEach((newSubRef) => {
      if (color.hexa === newSubRef.color?.hexa) {
        this.newRef.emit(newSubRef)
      }
    })
  }
}
