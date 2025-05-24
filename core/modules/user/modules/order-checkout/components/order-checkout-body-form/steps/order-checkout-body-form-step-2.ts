import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
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

declare const google: any; // Asegúrate de que el objeto `google` esté accesible globalmente

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
          #autocompleteInput
          matInput
          placeholder="Cra 9..."
        />
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Información adicional</mat-label>
        <input
        formControlName="aditiionalAddress"
        #autocompleteInput
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
export class OrderCheckoutBodyFormStep2Component implements AfterViewInit {
  @Input() formGroup!: FormGroup; // Asegúrate de que este formGroup viene desde el padre
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef; // Referencia al input de autocompletado
  autocomplete!: any; // Variable para manejar el Autocomplete de Google

  // Listas de departamentos y municipios
  departamentosList: string[] = departamentosList;
  departamentosYMunicipios: any = departamentosYMunicipios;
  municipiosList: string[] = [];

  constructor() {}

  // Método para cargar el autocompletado de Google Places después de que la vista esté inicializada
  ngAfterViewInit(): void {
    /* this.loadGooglePlacesAutocomplete(); */
  }

  // Carga la funcionalidad de autocompletado de Google Places
  loadGooglePlacesAutocomplete() {
    const input = this.autocompleteInput.nativeElement;
    if (typeof document !== 'undefined') {
      if (google && google.maps && google.maps.places) {
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'co' }, // Restringir a Colombia
          types: ['geocode'], // Solo sugerencias de direcciones
        });

        // Agrega un listener para cuando se selecciona un lugar
        this.autocomplete.addListener('place_changed', () => {
          const place = this.autocomplete.getPlace();
          if (place.geometry) {
            // Extraer y asignar la dirección completa
            this.formGroup.get('address')?.setValue(place.formatted_address);

            // Extraer los componentes de la dirección
            const addressComponents = place.address_components;
            let departamento = '';
            let municipio = '';
            let postalCode = '';

            // Iterar sobre los componentes de la dirección para encontrar los valores necesarios
            addressComponents.forEach(
              (component: { types: any[]; long_name: string }) => {
                const componentType = component.types[0];

                if (componentType === 'administrative_area_level_1') {
                  departamento = component.long_name; // Nivel de departamento
                } else if (
                  componentType === 'locality' ||
                  componentType === 'administrative_area_level_2'
                ) {
                  municipio = component.long_name; // Nivel de ciudad o municipio
                } else if (componentType === 'postal_code') {
                  postalCode = component.long_name; // Código postal
                }
              }
            );

            // Asignar los valores extraídos a los controles del formulario
            this.formGroup.get('departamento')?.setValue(departamento);
            this.formGroup.get('municipio')?.setValue(municipio);
            this.formGroup.get('municipio')?.enable();
            this.formGroup.get('postalCode')?.setValue(postalCode);

          }
        });
      } else {
        console.error('Google Maps API no está disponible.');
      }
    }


  }

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
