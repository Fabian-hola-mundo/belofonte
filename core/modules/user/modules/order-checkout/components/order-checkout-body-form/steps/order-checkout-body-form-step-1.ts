import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@Component({
  selector: 'bel-order-checkout-body-form-step-1',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  template: `
    <div [formGroup]="formGroup" class="container">
      <!--      <p>Datos personales</p> -->
      <mat-form-field appearance="outline">
        <mat-label>Correo electrónico</mat-label>
        <input
          required
          formControlName="mailCtrl"
          matInput
          placeholder="tucorreo@gmail.com"
           autocomplete="email"
        />
        <mat-icon matSuffix>mail</mat-icon>
        <mat-error *ngIf="formGroup.get('mailCtrl')?.hasError('required')">
          El correo es obligatorio
        </mat-error>
        <mat-error *ngIf="formGroup.get('mailCtrl')?.hasError('email')">
          El correo no tiene un formato válido
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Nombres completos</mat-label>
        <input
          required
          formControlName="nameCtrl"
                  [matAutocomplete]="auto"
          autocomplete="name"
          matInput
          placeholder="Joe Doe"
        />
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
            {{ option }}
          </mat-option>
        </mat-autocomplete>
        <mat-icon matSuffix>person</mat-icon>
        <mat-error *ngIf="formGroup.get('nameCtrl')?.hasError('required')">
          El nombre es obligatorio
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Teléfono</mat-label>
        <span matTextPrefix>+57 </span>
        <input
          formControlName="phoneCtrl"
          matInput
          type="tel"
          required
          autocomplete="tel-national"
          placeholder="320 200 9000"
        />
        <mat-icon matSuffix>phone</mat-icon>
        <mat-error *ngIf="formGroup.get('phoneCtrl')?.hasError('required')">
          El teléfono es obligatorio
        </mat-error>
        <mat-error *ngIf="formGroup.get('phoneCtrl')?.hasError('pattern')">
          El teléfono solo puede contener números
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Documento de Identidad</mat-label>
        <input
          formControlName="idCtrl"
          matInput
          placeholder="1.000.000.000"
          type="number"
           (keydown.enter)="goToNextStep()"
        />
        <mat-icon matSuffix>badge</mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: `
  @import '../../../../../../../../src/styles.scss';
  :host {
    & .container {
      display: flex;
      flex-direction: column;
      gap: 12px;

      & mat-form-field {
        width: 100%;
        & mat-icon, span {
          color: var(--md-sys-color-primary);
        }
        span {
          padding-right: 8px;
        }
      }
    }
  }
  `,
})
export class OrderCheckoutBodyFormStep1Component {
  productForm!: any;
  @Input() formGroup!: FormGroup;
  @Input() stepper!: MatStepper
  options: string[] = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    // Configurar el autocompletado del campo de nombres
    this.filteredOptions = this.formGroup.get('nameCtrl')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  goToNextStep(): void {
    if (this.formGroup.valid) {
      this.stepper.next();  // Esto mueve el stepper al siguiente paso
    }
  }

  constructor(private formBuilder: FormBuilder) {}

  formatDocumentId(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Remover todo lo que no sea un dígito
    value = value.replace(/\D/g, '');

    // Agregar puntos cada tres dígitos
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Actualizar el valor en el control
    this.formGroup.get('idCtrl')?.setValue(value, { emitEvent: false });
  }
}
