import { Component, Input, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { InventoryItem, Product } from '../../../../../admin/interface/products';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { url } from 'inspector';
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
  @Input() data!: Product;
  colors: any[] = [];
  firstColor : {} = {}

  subRefSelected: InventoryItem = {
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
  availableSizes : any[] = []

  ngOnInit() {
    this.extractColors();
    console.log(this.data);
/*     this.data.inventory.forEach(subRef => {
      if (subRef.color === this.firstColor) {
        this.availableSizes.push(subRef.size)
        console.log(this.availableSizes);
      } else {

      }
    }); */
    this.getSubRef()
  }

  getSubRef(){
    this.data.inventory.forEach(subRef => {
      if (this.firstColor === subRef.color) {
        this.subRefSelected = subRef
        console.log(this.subRefSelected);

      }
  })
  }



  changeProductRef(color: any){
    this.availableSizes = []
    this.data.inventory.forEach(subRef => {
      if (subRef.color === color) {
  /*       this.availableSizes.push(subRef.size) */
        this.subRefSelected = subRef
        console.log(this.subRefSelected);

      } else {

      }
    });
  }

  extractColors2(){
    this.data.inventory.forEach(subRef => {
      if (subRef.color) {
        this.colors.push(subRef.color)
        console.log(subRef.color);

      }
    });
  }

  extractColors() {
    // Filtrar valores undefined antes de asignar
    this.colors = this.data.inventory
      .map((item) => item.color)
      .filter((color): color is Color => color !== undefined);
      this.firstColor = this.colors[0]
  }

}