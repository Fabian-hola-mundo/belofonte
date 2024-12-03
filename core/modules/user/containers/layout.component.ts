import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from '../components/nav/nav.component';
import { FiltersService } from '../modules/productos/services/filters.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'bel-layout',
  standalone: true,
  styleUrl: './layout.component.scss',
  imports: [
    RouterModule,
    MatButtonModule,
    NavComponent,
    CommonModule,
    FooterComponent,
  ],
  template: `
    <bel-nav
      [isScrolledHalfway]="isScrolledHalfway"
      [isScrollingUp]="isScrollingUp"
    />
    <router-outlet
      [ngClass]="{ 'nav--active': isScrolledHalfway }"
    ></router-outlet>
    <bel-footer></bel-footer>
  `,
})
export class LayoutComponent {
  isScrolledHalfway: boolean = false;
  isScrollingUp = true;
  lastScrollPosition = 0;
  scrollThreshold = 200; // Threshold for small scroll (in pixels)

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset || 0;

    // Check scroll direction
    this.isScrollingUp = currentScrollPosition < this.lastScrollPosition;

    // Detect if the user has scrolled past the threshold
    if (currentScrollPosition > this.scrollThreshold) {
      this.isScrolledHalfway = true;
    } else {
      this.isScrolledHalfway = false;
    }

    // Update the last scroll position
    this.lastScrollPosition = currentScrollPosition;
  }
}
