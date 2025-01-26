import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LayoutComponent } from '../../../containers/layout.component';

export const layutRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('../../routes/lib.routes').then((m) => m.layutRoutes),
    title: 'Belofonte',
  },
];

@NgModule({
  imports: [RouterModule.forChild(layutRoutes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
