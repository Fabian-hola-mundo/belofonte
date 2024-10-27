import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsPageComponent } from '../containers/products/products.page.component';
import { ProductsListComponent } from '../components/products-list/products.list.component';
import { NotFoundComponent } from '../../extra/not-found/not-found.component';
import { OrderCheckoutContainer } from '../../order-checkout/containers/order.checkout.container';

export const layutRoutes: Route[] = [
  {
    path: '',
    component: ProductsPageComponent,
    children: [
      {
        path: '',
        component: ProductsListComponent,
        pathMatch: 'full',
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path:'**',
        component: NotFoundComponent
      },

    ],

  },

];

@NgModule({
  imports: [RouterModule.forChild(layutRoutes)],
  exports: [RouterModule],
})
export class ProductsListRoutingModule {}
