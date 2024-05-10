import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface producInterface {
  name: string;
  image: string;
  title: string;
}

@Component({
  selector: 'bel-product-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {

  @Input() product?: producInterface

}
