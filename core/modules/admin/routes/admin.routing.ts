import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/log/login/login/login.component';
import { AdminLayoutComponent } from '../containers/layout.component';
import { ProductsComponent } from '../components/products/products/products.component';
import { OrdersComponent } from '../components/orders/orders.component';

export const adminRoutes: Routes = [
  {
    path: 'panel',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductsComponent,
        pathMatch: 'full',
      },
/*       {
        path: 'orders',
        component: OrdersComponent,
        pathMatch: 'full',
      }, */
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'prefix',
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
