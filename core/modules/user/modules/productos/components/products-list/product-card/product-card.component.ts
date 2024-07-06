import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../../../admin/interface/products';
import { CommonModule } from '@angular/common';

export interface producInterface {
  name: string;
  image: string;
  title: string;
}

@Component({
  selector: 'bel-product-card',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {

  @Input() product?: Product

}
