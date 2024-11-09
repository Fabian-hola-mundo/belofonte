import { Component, HostListener, Inject, inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DialogService } from '../shopping-card/shopping-card-config';
import {MatBadgeModule} from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwichThemeComponent } from "../swich-theme/swich-theme.component";

@Component({
  selector: 'bel-nav',
  standalone: true,
  styleUrl: './nav.component.scss',
  imports: [
    MatButtonModule,
    MatRippleModule,
    MatButtonModule,
    RouterModule,
    MatBadgeModule,
    MatIconModule,
    SwichThemeComponent
],
  template: `
    <nav>
      <ul class="navigation">
        <li class="logo" routerLink="./">
          <svg
            width="74"
            height="62"
            viewBox="0 0 74 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_13_118)">
              <path
                class="fill-svg"
                d="M53.569 25.5462V27.9304H25.3502C23.7663 27.9304 22.2144 27.7856 20.7103 27.5042C13.9518 26.2458 8.13489 22.2816 4.40457 16.7735C2.4656 13.9149 1.08917 10.6422 0.434872 7.11627C0.147617 5.58044 0 4.00039 0 2.38415V0H28.2228C36.9282 0 44.6043 4.42254 49.1684 11.1569C51.9452 15.2537 53.569 20.207 53.569 25.5462Z"
              />
              <path
                class="fill-svg"
                d="M74 62H42.1067C36.1262 62 31.2788 57.1151 31.2788 51.0884H63.1721C67.0061 51.0884 70.3734 53.0946 72.2924 56.1261C73.3736 57.8227 74 59.837 74 62Z"
              />
              <path
                class="fill-svg"
                d="M53.5692 31.1265V48.0527H36.7768C35.0932 48.0527 33.4694 47.8035 31.9374 47.3371C25.0193 45.2464 19.9844 38.7775 19.9844 31.1265H53.5692Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_13_118">
                <rect width="74" height="62" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </li>
        <li>
          </li>
          <li class="navigation--actions">
            <div>
              <ul>
              <bel-swich-theme/>
              <li matRipple role="navigation">
                <button mat-icon-button (click)="openDialog()">
                  <mat-icon [matBadge]="totalItems">shopping_cart</mat-icon>
                </button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  `,
})

export class NavComponent implements OnInit {
  totalItems: number = 0;
  private isDarkMode = false;
  private isBrowser: boolean;

  constructor(
    private dialogService: DialogService,
    private cartService: CartService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Determina si estamos en el navegador
  }

  ngOnInit(): void {
    // Solo en el navegador
    if (this.isBrowser) {
      // Recupera el tema guardado en localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Si no hay un tema guardado, usa la preferencia del sistema
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      /* this.applyTheme(); */
    }

    // Escucha cambios en el carrito para actualizar el total de items
    this.cartService.cartItems$.subscribe(items => {
      this.totalItems = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  openDialog() {
    if (this.isBrowser) {
      this.dialogService.openShoppingCardDialog();
    }
  }
}
