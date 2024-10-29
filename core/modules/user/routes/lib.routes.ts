import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from '../containers/layout.component';
import LandingPageComponent from '../modules/home/containers';
import { ProductContainer } from '../modules/product/containers/product.container';
import { OrderCheckoutContainer } from '../modules/order-checkout/containers/order.checkout.container';
import { OrderCheckoutResultContainer } from '../modules/order-checkout/containers/order.checkout.result.container';

export const layutRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
        pathMatch: 'full',
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('../modules/productos/routes/lib.routes').then(
            (m) => m.ProductsListRoutingModule
          ),
        pathMatch: 'full',
      },
      { path: '', redirectTo: '', pathMatch: 'full' },

    ],
  },
  {
    path: 'producto/:slug',
    component: ProductContainer,
  },
  {
    path: 'checkout',
    component: OrderCheckoutContainer,
    pathMatch: 'full'
  },
  {
    path: 'checkout/:id',
    component: OrderCheckoutResultContainer,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(layutRoutes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
