import { Component} from '@angular/core';
import { AboveTheFoldComponent } from '../../components/above.the.fold/above.the.fold.component';

@Component({
  selector: 'lib-landing-page',
  standalone: true,
  styleUrl: './landing.page.component.scss',
  imports: [
    AboveTheFoldComponent
  ],
  template: `
  <bel-above-the-fold/>
  `,
})
export class LandingPageComponent{

}
