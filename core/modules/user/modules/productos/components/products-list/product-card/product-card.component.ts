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
  imports: [MatIconModule, CommonModule,],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {
  activeImageIndex = 0;
  @Input() product?: Product

  selectImage(index: number) {
    this.activeImageIndex = index;
    const container = document.querySelector('.figure');
    if (container) {
      const activeImage = container.querySelectorAll('.product--img')[index];
      activeImage.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }

   onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const images = container.querySelectorAll('.product--img');
    let closestIndex = 0;
    let minDistance = Infinity;

    images.forEach((image, index) => {
      const rect = image.getBoundingClientRect();
      const distance = Math.abs(rect.left - container.getBoundingClientRect().left);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    this.activeImageIndex = closestIndex;
  }

}
