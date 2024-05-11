import { Component, Input } from '@angular/core';
import { DataModel } from '../../../models/forms.model';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.component.html',
  styleUrls: ['./second-step.component.scss']
})
export class SecondStepComponent {

  @Input() secondData! : DataModel[]

}
