import { Component, HostListener} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'bel-products',
  standalone: true,
  styleUrl: './products.page.component.scss',
  imports: [
    RouterModule
  ],
  template: `
  <router-outlet></router-outlet>
  `,
})
export class ProductsPageComponent{
  isScrolledHalfway: boolean = false;
  showFilters: any
  constructor(
    public _showFilters: FiltersService,
  ){
    this._showFilters.setInProducts(true); // Establece el valor inicial
  }
  ngOnInit(): void {
      this._showFilters.inProducts$.subscribe((value) => {
    this.showFilters = value;
  });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      0;
    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight || 0;

    if (scrollPosition > documentHeight / 1.3 - windowHeight) {
      this.isScrolledHalfway = true;
    } else {
      this.isScrolledHalfway = false;
    }
  }

}
