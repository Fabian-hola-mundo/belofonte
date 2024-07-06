import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Color } from '../../../interface/color';
import { ConfigurationColorService } from '../../../services/color-of-product.service';

@Component({
  selector: 'app-create-color',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-color.component.html',
  styleUrls: ['./create-color.component.scss'],
})
export class CreateColorComponent {
  colorForm: any;

  constructor(
    private dialogRef: MatDialogRef<CreateColorComponent>,
    private configurationColorService: ConfigurationColorService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Color = { name: '', hexa: '' }
  ) {
    this.colorForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      hexa: new FormControl('#000', [Validators.required]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveColor(): Promise<void> {
    if (this.colorForm.valid) {
      await this.configurationColorService.addColor2(this.colorForm.value);
      this.colorForm.reset();
      this.dialogRef.close(this.colorForm.value);
    }
  }
}
