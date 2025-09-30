import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { departamentosList } from '../../../constants/departaments';
import { departamentosYMunicipios } from '../../../constants/municipality';


@Component({
  selector: 'bel-order-checkout-body-form-step-2',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div [formGroup]="formGroup" class="container">
      <!-- Campo de dirección con autocompletado -->
      <mat-form-field appearance="outline">
        <mat-label>Dirección (Calle & Número)</mat-label>
        <input
          formControlName="address"
          matInput
          placeholder="Cra 9..."
        />
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Información adicional</mat-label>
        <input
        formControlName="aditiionalAddress"
        matInput
        placeholder="Apartamentos ... Casa ..."
        />
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>

      <!-- Campo para seleccionar el departamento -->
      <mat-form-field appearance="outline">
        <mat-label>Departamento</mat-label>
        <mat-select
        formControlName="departamento"
        (selectionChange)="onDepartamentoChange($event.value)"
        >
        <mat-option
        *ngFor="let departamento of departamentosList"
            [value]="departamento"
            >
            {{ departamento }}
          </mat-option>
        </mat-select>
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>

      <!-- Campo para seleccionar el municipio -->
      <mat-form-field appearance="outline" *ngIf="formGroup.get('municipio')">
        <mat-label>Municipio</mat-label>
        <input formControlName="municipio" matInput placeholder="Municipio" />
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>
      <!--       <mat-form-field appearance="outline" >
        <mat-label>Municipio</mat-label>
        <mat-select formControlName="municipio">
          <mat-option
          *ngFor="let municipio of municipiosList"
          [value]="municipio"
          >
          {{ municipio }}
        </mat-option>
      </mat-select>
    </mat-form-field> -->
    <!-- Campo para el código postal -->
    <mat-form-field appearance="outline">
      <mat-label>Código postal</mat-label>
      <input
      formControlName="postalCode"
          matInput
          placeholder="Código postal"
          />
          <mat-icon matSuffix>location_on</mat-icon>
        </mat-form-field>
    </div>
  `,
  styles: [
    `
      :host {
        & .container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          mat-form-field {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class OrderCheckoutBodyFormStep2Component {
  @Input() formGroup!: FormGroup; // Asegúrate de que este formGroup viene desde el padre

  // Listas de departamentos y municipios
  departamentosList: string[] = departamentosList;
  departamentosYMunicipios: any = departamentosYMunicipios;
  municipiosList: string[] = [];

  constructor() {}



  onDepartamentoChange(departamento: string) {
    // Actualizar la lista de municipios basados en el departamento seleccionado
    this.municipiosList = this.departamentosYMunicipios[departamento] || [];

    // Acceder al control 'municipio' dentro del formGroup
    const municipioControl = this.formGroup.get('municipio');

    // Habilitar o deshabilitar el control según la lista de municipios
    if (this.municipiosList.length > 0) {
      municipioControl?.enable();
    } else {
      municipioControl?.disable();
      municipioControl?.reset();
    }
  }
}
