import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { CreateSizeComponent } from "../../../../dialogs/create-size/create-size.component";
import { Color } from "../../../../../interface/color";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { CreateColorComponent } from "../../../../dialogs/create-color/create-color.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { uploadBytesResumable, uploadBytes, getStorage, ref } from 'firebase/storage';

const MAT = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatRippleModule,
  MatStepperModule,
  MatSelectModule,
  MatIconModule
];

const FORM = [
  ReactiveFormsModule,
  FormsModule
];

@Component({
  selector: 'bel-create-product-third-step',
  standalone: true,
  imports: [
    CommonModule,
    ...MAT,
    ...FORM
  ],
  templateUrl: './third.step.component.html'
})
export class CreateProductThirdStep implements OnInit {
  color!: Color;
  colors!: Color[];
  productForm!: FormGroup;
  sizes!: { name: string }[];

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      inventory: this.formBuilder.array([this.createInventoryItem()])
    });
  }

  addImageItem(index: number) {
    const inventory = this.productForm.get('inventory') as FormArray;
    const images = inventory.at(index).get('images') as FormArray;
    images.push(this.createImageItem());
  }

  addSizeItem(subRef: any){
    const inventory = this.productForm.get('inventory'[subRef]) as FormArray;
    inventory.push(this.createInventoryItem());
  }

  createImageItem(): FormGroup {
    return this.formBuilder.group({
      url: new FormControl('', Validators.required),
      alt: new FormControl('', Validators.required),
    });
  }

  addInventoryItem() {
    const inventory = this.productForm.get('inventory') as FormArray;
    inventory.push(this.createInventoryItem());
    this.calculateTotalStock();
  }

  calculateTotalStock() {
    const inventory = this.productForm.get('inventory') as FormArray;
    let total = 0;
    for (let i = 0; i < inventory.length; i++) {
      total += inventory.at(i).get('count')?.value || 0;
    }
    /* this.productForm.get('control').get('totalStock')?.setValue(total); */
  }

  createInventoryItem(): FormGroup {
    return this.formBuilder.group({
      subRef: new FormControl('', [Validators.required]),
      size: new FormControl('', [Validators.required]),
      color: new FormGroup({
        name: new FormControl(''),
        hexa: new FormControl(''),
      }),
      count: new FormControl(0, [Validators.required, Validators.min(0)]),
      images: this.formBuilder.array([this.createImageItem()]),
    });
  }

  openCreateSizeDialog(): void {
    const dialogRef = this.dialog.open(CreateSizeComponent, {
      data: this.color,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.color = result;
      this.openSnackBar(`El Tamaño ${result.name} ha sido creado`, 'Cerrar');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 8000,
    });
  }

  openCreateColorDialog(): void {
    const dialogRef = this.dialog.open(CreateColorComponent, {
      data: this.color,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.color = result;
      this.openSnackBar(`El Color ${result.name} ha sido creado`, 'Cerrar');
    });
  }

  uploadFile(event: any) {
    const image = event.target.files;
    const name = 'products/category.png';
    const storage = getStorage();
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, image[0]);
    if (image) {
      uploadBytesResumable(storageRef, image)
    }
  }
}
