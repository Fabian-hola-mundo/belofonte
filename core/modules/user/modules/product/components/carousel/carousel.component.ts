import { Component, HostListener, Input } from "@angular/core";
import { Product } from "../../../../../admin/interface/products";
import { CommonModule } from "@angular/common";

@Component({
  selector: "bel-product-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./carousel.component.html",
  styleUrl: './carousel.component.scss',
})

export class CarouselComponent {
  @Input() images: any;
  private lastScrollTop = 0; // Variable para rastrear la posición previa de scroll

  @HostListener('scroll', ['$event'])
  onDesktopScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    const snapPoint = clientHeight;

    // Detecta la dirección de desplazamiento
    const isScrollingDown = scrollTop > this.lastScrollTop;

    // Actualiza la posición anterior
    this.lastScrollTop = scrollTop;

    // Lógica de ajuste de desplazamiento en función de la dirección
    if (isScrollingDown) {
      // Desplazarse hacia abajo
      if (scrollTop % snapPoint > snapPoint / 20000) {
        target.scrollTo({
          top: Math.ceil(scrollTop / snapPoint) * snapPoint,
          behavior: 'smooth'
        });
      }
    } else {
      // Desplazarse hacia arriba
      if (scrollTop % snapPoint < snapPoint / 20000) {
        target.scrollTo({
          top: Math.floor(scrollTop / snapPoint) * snapPoint,
          behavior: 'smooth'
        });
      }
    }
  }
}
