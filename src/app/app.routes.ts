import { Route } from '@angular/router';

export const appRoute: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: '',
    loadChildren: () =>
      import('../../layout/lib.routes').then((m) => m.layutRoutes),
    title: 'Belofonte',
  },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'admin',
    loadChildren: () => import('../../layout/admin/routes/admin.routing').then((m) => m.adminRoutes),
  }
];
