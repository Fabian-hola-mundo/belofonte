import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDrawerMode } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private readonly MOBILE_BREAKPOINT = '(max-width: 1007px)';
  
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeBreakpointObserver();
  }

  /**
   * Inicializa el observer de breakpoints
   */
  private initializeBreakpointObserver(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.breakpointObserver
        .observe([this.MOBILE_BREAKPOINT])
        .subscribe((state: BreakpointState) => {
          this.isMobileSubject.next(state.matches);
        });
    }
  }

  /**
   * Obtiene el modo del drawer según el breakpoint
   */
  getDrawerMode$(): Observable<MatDrawerMode> {
    return this.isMobile$.pipe(
      map(isMobile => isMobile ? 'over' : 'side')
    );
  }

  /**
   * Verifica si estamos en móvil de forma síncrona
   */
  isMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth <= 1007;
    }
    return false;
  }

  /**
   * Obtiene el ancho de la ventana
   */
  getWindowWidth(): number {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth;
    }
    return 1200; // Valor por defecto para SSR
  }

  /**
   * Observable que indica si el drawer debe estar abierto por defecto
   */
  shouldDrawerBeOpen$(): Observable<boolean> {
    return this.isMobile$.pipe(
      map(isMobile => !isMobile)
    );
  }
}
