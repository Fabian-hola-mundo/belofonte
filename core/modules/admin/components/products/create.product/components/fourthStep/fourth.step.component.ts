import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { FormsDataModel } from "../../../../../interface/forms.model";

const MAT = [
  MatStepperModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatRippleModule
];

const FORM = [
  ReactiveFormsModule,
  FormsModule
];

@Component({
  selector: 'bel-create-product-fourth-step',
  standalone: true,
  imports: [    
    CommonModule,
    ...MAT,
    ...FORM
  ],
  templateUrl: './fourth.step.component.html'
})
export class CreateProductFourthtStep {

  @Output() onSubmit = new EventEmitter<void>();
  @Input() stepFourthForm: FormsDataModel = {
    input: 'input',
    label: '',
    placeholder: '',
    formControlName: ''
  }

  @Input() group = ''

  onSubmitEmitter() {
    this.onSubmit.emit();
  }

}
