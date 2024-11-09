import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = false;
  private isBrowser: boolean;
  private renderer: any; // Declaramos renderer como "any" para inicializarlo después

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Determina si estamos en el navegador

    // Inicializar el tema desde el almacenamiento
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
    }
  }

  // Método para inicializar el renderer (lo llamaremos desde el componente)
  setRenderer(renderer: any) {
    this.renderer = renderer;
    this.applyTheme(); // Aplica el tema inicial
  }

  toggleTheme() {
    if (this.isBrowser) {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme); // Guarda el tema en localStorage
      this.applyTheme();
    }
  }

  applyTheme() {
    if (this.isBrowser && this.renderer) { // Verifica que renderer esté definido
      const theme = this.isDarkMode ? 'dark' : 'light';
      this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
    }
  }
}
