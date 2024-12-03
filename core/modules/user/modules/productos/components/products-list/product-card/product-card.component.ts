import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../../../admin/interface/products';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SelectedProductService } from '../../../../../services/selected-product.service';
import { MatRippleModule } from '@angular/material/core';

export interface producInterface {
  name: string;
  image: string;
  title: string;
}

@Component({
  selector: 'bel-product-card',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatRippleModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})


export class ProductCardComponent {
  activeImageIndex = 0;
  @Input() product!: Product
  selectedColor: any;
  filteredImages?: { url: string; alt: string }[] = [];



  selectImage(index: number) {
    this.activeImageIndex = index;
    const container = document.querySelector('.figure');
    if (container) {
      const activeImage = container.querySelectorAll('.product--img')[index];
      activeImage.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }

  changeProductColor(color: any) {
    this.selectedColor = color; // Actualiza el color seleccionado

    // Encuentra el inventario correspondiente al color seleccionado
    const inventoryForColor = this.product.inventory.find(
      (inventory) => inventory.color?.hexa === color?.hexa
    );

    // Actualiza las miniaturas si existe un inventario asociado al color
    if (inventoryForColor) {
      this.activeImageIndex = 0; // Reinicia el índice de la imagen activa
      this.filteredImages = inventoryForColor.images; // Actualiza las imágenes filtradas
    }
  }



  constructor(
    private router: Router,
    private selectedProductService: SelectedProductService
  ){

  }

  openProduct(product: Product) {
    this.selectedProductService.setSelectedProduct(product); // Establece el producto seleccionado
    this.router.navigate(['/producto', product.slug]); // Navega a la página del producto
  }

  ngOnInit(): void {
    if (this.product?.inventory?.length) {
      this.selectedColor = this.product.inventory[0].color; // Selecciona el primer color como predeterminado
      this.filteredImages = this.product.inventory[0].images; // Carga las imágenes del primer inventario
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
