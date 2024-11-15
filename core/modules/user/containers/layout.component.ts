import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { NavComponent } from '../components/nav/nav.component';
import { FiltersService } from '../modules/productos/services/filters.service';

@Component({
  selector: 'bel-layout',
  standalone: true,
  styleUrl:  './layout.component.scss',
  imports: [
    RouterModule,
    MatButtonModule,
    NavComponent
  ],
  template: `
  <bel-nav/>
  <router-outlet></router-outlet>

  `,
})
export class LayoutComponent{

}
