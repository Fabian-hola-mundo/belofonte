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
import { ConfigurationSizeService } from '../../../services/size-of-product.service';

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
  templateUrl: './create-size.component.html',
  styleUrls: ['./create-size.component.scss'],
})
export class CreateSizeComponent {
  sizeForm: any;

  constructor(
    private dialogRef: MatDialogRef<CreateSizeComponent>,
    private configurationSizeService: ConfigurationSizeService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Color = { name: '', hexa: '' }
  ) {
    this.sizeForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveSize(): Promise<void> {
    if (this.sizeForm.valid) {
      await this.configurationSizeService.addSize(this.sizeForm.value);
      this.sizeForm.reset();
      this.dialogRef.close(this.sizeForm.value);
    }
  }
}
