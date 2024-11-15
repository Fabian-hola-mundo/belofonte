import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DialogService } from '../shopping-card/shopping-card-config';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwichThemeComponent } from '../swich-theme/swich-theme.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavCardComponent } from '../../modules/productos/components/nav/nav-card/nav.card.component';
import { FiltersService } from '../../modules/productos/services/filters.service';

@Component({
  selector: 'bel-nav',
  standalone: true,
  styleUrl: './nav.component.scss',
  imports: [
    MatButtonModule,
    MatRippleModule,
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NavCardComponent,
    SwichThemeComponent,
  ],
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
  totalItems: number = 0;
  private isDarkMode = false;
  private isBrowser: boolean;
  showFilters$ = this._showFilters.inProducts$; // Asegúrate de inicializarlo como un observable
  public navCards = [
    {
      name: 'Hombres',
      router: 'hombres',
    },
    {
      name: 'Accesorios',
      router: 'accesorios',
    },
    {
      name: 'Mujeres',
      router: 'mujeres',
    },
  ];

  constructor(
    private dialogService: DialogService,
    public _showFilters: FiltersService,
    private cartService: CartService,
    @Inject(DOCUMENT) private document: Document,
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
        this.isDarkMode = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      }
      /* this.applyTheme(); */
      this.showFilters$ = this._showFilters.inProducts$
    }

    // Escucha cambios en el carrito para actualizar el total de items
    this.cartService.cartItems$.subscribe((items) => {
      this.totalItems = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  openDialog() {
    if (this.isBrowser) {
      this.dialogService.openShoppingCardDialog();
    }
  }
}
