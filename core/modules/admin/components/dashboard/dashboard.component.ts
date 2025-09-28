import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bel-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  
  dashboardCards = [
    {
      title: 'Productos',
      subtitle: 'Gestionar inventario',
      icon: 'inventory_2',
      route: '/admin/products',
      color: 'primary'
    },
    {
      title: 'Pedidos',
      subtitle: 'Ver pedidos recientes',
      icon: 'shopping_cart',
      route: '/admin/pedidos',
      color: 'secondary'
    },
    {
      title: 'Clientes',
      subtitle: 'Base de clientes',
      icon: 'people',
      route: '/admin/clientes',
      color: 'tertiary'
    },
    {
      title: 'Reportes',
      subtitle: 'Análisis y métricas',
      icon: 'analytics',
      route: '/admin/reportes',
      color: 'success'
    }
  ];

  constructor() { }
}
