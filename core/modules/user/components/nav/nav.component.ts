import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DialogService } from '../shopping-card/shopping-card-config';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwichThemeComponent } from '../swich-theme/swich-theme.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavCardComponent } from '../../modules/productos/components/nav/nav-card/nav.card.component';
import { FiltersService } from '../../modules/productos/services/filters.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { NavSkeletonComponent } from "./nav-skeleton/nav-skeleton.component";

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
    MatMenuModule,
    MatIconModule,
    NavCardComponent,
    FormsModule,
    SwichThemeComponent,
    NavSkeletonComponent
],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  totalItems: number = 0;
  private isDarkMode = false;
  private isBrowser: boolean;
  @Input() isScrolledHalfway: boolean = false;
  @Input() isScrollingUp: boolean = true;

  isFocused = false;
  searchValue = ''; // Para capturar el valor que escribe el usuario
  animatedPlaceholder = 'Search anything...';
  productNames = [
    'Camiseta deportiva',
    'Zapatillas de running',
    'Pantalón de yoga',
    'Guantes de gimnasio',
    'Balón de fútbol',
    'Botella de agua',
    'Gorra deportiva',
    'Sudadera con capucha',
    'Mochila deportiva',
    'Calcetines de compresión'
  ];

  currentIndex = 0; // Índice del producto actual
  typingSpeed = 100; // Velocidad de escritura
  pauseBetweenWords = 1500; // Pausa entre nombres
  isInProductosRoute = false;
  isLoading = true;

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
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router
  ) {
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      // Check if the current route contains "productos"
      this.isInProductosRoute = event.urlAfterRedirects.includes('/productos');
    });
    this.isBrowser = isPlatformBrowser(platformId); // Determina si estamos en el navegador
  }

  ngOnInit(): void {
    // Solo en el navegador
    this.isLoading = true;
    if (this.isBrowser) {
      this.animatePlaceholder();
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
      this.showFilters$ = this._showFilters.inProducts$;
    }

    // Escucha cambios en el carrito para actualizar el total de items
    this.cartService.cartItems$.subscribe((items) => {
      this.totalItems = items.reduce((total, item) => total + item.quantity, 0);
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Simula 3 segundos de carga
  }

  openDialog() {
    if (this.isBrowser) {
      this.dialogService.openShoppingCardDialog();
    }
  }

  animatePlaceholder(): void {
    let charIndex = 0;

    const type = () => {
      if (!this.isFocused) {
        this.animatedPlaceholder = this.productNames[this.currentIndex].slice(
          0,
          charIndex + 1
        );
        charIndex++;
      }

      if (!this.isFocused && charIndex < this.productNames[this.currentIndex].length) {
        setTimeout(type, this.typingSpeed);
      } else if (!this.isFocused) {
        setTimeout(deletePlaceholder, this.pauseBetweenWords);
      }
    };

    const deletePlaceholder = () => {
      if (!this.isFocused) {
        this.animatedPlaceholder = this.animatedPlaceholder.slice(0, -1);
      }

      if (!this.isFocused && this.animatedPlaceholder.length > 0) {
        setTimeout(deletePlaceholder, this.typingSpeed / 2);
      } else if (!this.isFocused) {
        resetPlaceholder();
      }
    };

    const resetPlaceholder = () => {
      charIndex = 0;
      this.currentIndex = (this.currentIndex + 1) % this.productNames.length;
      type();
    };

    type();
  }

  // Métodos para manejar el foco
  onFocus(): void {
    this.isFocused = true;
    this.animatedPlaceholder = ''; // Limpia el placeholder al enfocar
  }

  onBlur(): void {
    this.isFocused = false;
    this.animatePlaceholder(); // Reactiva la animación al perder el foco
  }
}
