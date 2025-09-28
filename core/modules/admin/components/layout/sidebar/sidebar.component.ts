import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { simboloBelofonte } from '../../../../../constants/svg-logo';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatRippleModule, 
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() sidebarOutput = new EventEmitter<void>();

  simboloBelofonte = simboloBelofonte;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/admin',
      icon: 'dashboard'
    },
    {
      label: 'Productos',
      route: '/admin/products',
      icon: 'inventory_2'
    },
    {
      label: 'Pedidos',
      route: '/admin/pedidos',
      icon: 'shopping_cart'
    },
    {
      label: 'Clientes',
      route: '/admin/clientes',
      icon: 'people'
    },
    {
      label: 'Reportes',
      route: '/admin/reportes',
      icon: 'analytics'
    }
  ];

  constructor(private router: Router) {}

  /**
   * Emite evento para cerrar sidebar en móvil
   */
  onMenuItemClick(): void {
    this.sidebarOutput.emit();
  }

  /**
   * Verifica si la ruta está activa
   */
  isRouteActive(route: string): boolean {
    if (route === '/admin') {
      return this.router.url === '/admin';
    }
    return this.router.url.startsWith(route);
  }
}
