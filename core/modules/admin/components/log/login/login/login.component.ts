import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { simboloBelofonte } from '../../../../../../constants/svg-logo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  logoBelofonte = simboloBelofonte
  hide = true;

  input = [
    {
      label: 'Correo Electrónico',
      placeholder: 'tucorreo@correo.com',
      formControlName: 'email',
      matError: 'Materror',
    },
    {
      label: 'Contraseña',
      placeholder: '*******',
      formControlName: 'password',
      matError: 'Materror',
    },
  ];
}
