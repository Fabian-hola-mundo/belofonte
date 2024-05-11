import { Route } from '@angular/router';

export const appRoute: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: '',
    loadChildren: () =>
      import('../../core/modules/user/routes/lib.routes').then((m) => m.layutRoutes),
    title: 'Belofonte',
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'admin',
    loadChildren: () => import('../../core/modules/admin/routes/admin.routing').then((m) => m.adminRoutes),
  }
];
