import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// Servicios
import { SidebarService } from '../services/sidebar.service';
import { BreakpointService } from '../services/breakpoint.service';

// Componentes
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';
import { DesktopHeaderComponent } from '../components/layout/desktop-header/desktop-header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    AsyncPipe,
    SidebarComponent,
    DesktopHeaderComponent
  ],
  template: `
    <mat-drawer-container class="layout-container" autosize>
      <mat-drawer
        [opened]="showSidebar$ | async"
        (closedStart)="sidebarService.setSidebar(false)"
        #drawer
        class="layout-sidenav"
        [mode]="mode"
      >
        <app-sidebar (sidebarOutput)="onSidebarToggle()"></app-sidebar>
      </mat-drawer>
      
      <mat-drawer-content class="layout-content">
        <bel-desktop-header 
          *ngIf="!(showSidebar$ | async) || (isMobile$ | async)"
          (toggleSidebar)="onToggleSidebar()"
          (openNotifications)="onOpenNotifications()">
        </bel-desktop-header>
        
        <main class="layout-main" [class.layout-main--with-header]="!(showSidebar$ | async) || (isMobile$ | async)">
          <router-outlet></router-outlet>
        </main>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styleUrls: ['./layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  mode: MatDrawerMode = 'side';
  showSidebar$ = this.sidebarService.showSidebar$;
  isMobile$ = this.breakpointService.isMobile$;

  private subscriptions = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private breakpointService: BreakpointService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeLayout();
    this.setupBreakpointSubscription();
    this.setupRouterSubscription();
  }

  /**
   * Inicializa la configuración del layout
   */
  private initializeLayout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Configurar estado inicial del sidebar basado en el tamaño de pantalla
      const isMobile = this.breakpointService.isMobile();
      this.sidebarService.setSidebar(!isMobile);
    }
  }

  /**
   * Configura la suscripción a cambios de breakpoint
   */
  private setupBreakpointSubscription(): void {
    const breakpointSub = this.breakpointService.getDrawerMode$().subscribe((mode: MatDrawerMode) => {
      this.mode = mode;
      
      // En móvil, cerrar sidebar por defecto
      if (mode === 'over') {
        this.sidebarService.setSidebar(false);
      } else {
        this.sidebarService.setSidebar(true);
      }
    });

    this.subscriptions.add(breakpointSub);
  }

  /**
   * Configura la suscripción a cambios de ruta
   */
  private setupRouterSubscription(): void {
    const routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // En móvil, cerrar sidebar al navegar
        if (this.breakpointService.isMobile()) {
          this.sidebarService.closeSidebar();
        }
      });

    this.subscriptions.add(routerSub);
  }

  /**
   * Maneja el toggle del sidebar desde el header
   */
  onToggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  /**
   * Maneja el toggle del sidebar desde el sidebar mismo (para móvil)
   */
  onSidebarToggle(): void {
    if (this.breakpointService.isMobile()) {
      this.sidebarService.closeSidebar();
    }
  }

  /**
   * Maneja la apertura del panel de notificaciones
   */
  onOpenNotifications(): void {
    // TODO: Implementar panel de notificaciones
    console.log('Abrir panel de notificaciones');
  }

  /**
   * Limpieza de recursos
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
