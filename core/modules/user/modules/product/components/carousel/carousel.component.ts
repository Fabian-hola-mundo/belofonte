import { Component, Input } from "@angular/core";
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

  @Input() images: any

}
