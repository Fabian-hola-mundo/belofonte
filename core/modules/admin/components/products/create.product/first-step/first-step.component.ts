import { Component, Input } from '@angular/core';
import { DataModel } from '../../../models/forms.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss'],
})
export class FirstStepComponent {

  formulario!: FormGroup;

  constructor() {
    this.formulario = new FormGroup({
      
    })
  }

  @Input() firstData!: DataModel[];
}
