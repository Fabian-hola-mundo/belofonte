import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ProductsService } from '../../../../../services/products.service';
import { FormsDataModel } from '../../../interface/forms.model';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { CATEGORIES } from '../../../constants/catergorys';
import { ConfigurationColorService } from '../../../services/color-of-product.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateColorComponent } from '../../dialogs/create-color/create-color.component';
import { Color } from '../../../interface/color';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateSizeComponent } from '../../dialogs/create-size/create-size.component';
import { ConfigurationSizeService } from '../../../services/size-of-product.service';
import { MatSidenav } from '@angular/material/sidenav';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreModule,
} from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import {
  uploadBytesResumable,
  uploadBytes,
  getStorage,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const MAT = [
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatCheckboxModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatExpansionModule,
  TextFieldModule,
  MatRippleModule,
  MatProgressBarModule,
  MatSnackBarModule,
];

@Component({
  selector: 'bel-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT,
  ],
  templateUrl: './create.product.component.html',
  styleUrls: ['./create.product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  colors!: Color[];
  color!: Color;
  selectedColors: { [inventoryIndex: number]: string } = {}; // Objeto para almacenar colores seleccionados por índice
  sizes!: { name: string }[];
  size!: { name: string };
  lengthOfAllProducts!: number;
  @ViewChild('fileInput') fileInput!: ElementRef;

  productForm!: any;
  categories = CATEGORIES;
  rates: any = [1, 2, 3, 4, 5];
  image = {
    image: new FormControl(),
  };
  images = [this.image];

  firstData!: FormsDataModel[];
  secondData!: FormsDataModel[];

  private readonly _storage = inject(Firestore);

  constructor(
    private productService: ProductsService,
    private _snackBar: MatSnackBar,
    private configurationColorService: ConfigurationColorService,
    private side: MatSidenav,
    private configurationSizeService: ConfigurationSizeService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      category: [['']],
      subcategory: [['']],
      slug: ['', [Validators.required]],
      title: [''],
      description: [''],
      price: ['', [Validators.required, Validators.min(1)]],
      characteristics: this.formBuilder.group({
        height: [''],
        broad: [''],
        weight: [''],
      }),
      inventory: this.formBuilder.array([this.createInventoryItem()]),
      control: this.formBuilder.group({
        ref: ['', [Validators.required]],
        totalStock: [0, [Validators.required, Validators.min(0)]],
      }),
    });

    // Listener para actualizar el slug basado en el título
    this.productForm.get('title').valueChanges.subscribe((value: string) => {
      const slug = this.generateSlug(value);
      this.productForm.get('slug').setValue(slug, { emitEvent: false });
    });

    this.productForm.get('inventory').valueChanges.subscribe(() => {
      this.calculateTotalStock();
    });
  }

  async ngOnInit() {
    try {
      this.colors =
        await this.configurationColorService.getColorsFromCollection();
      this.sizes = await this.configurationSizeService.getSizeFromCollection();
      this.updateProductId();

      this.createFirstStep();
      this.createSecondStep();
    } catch (error) {
      console.error('Error al inicializar:', error);
    }
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  createFirstStep() {
    this.firstData = [
      {
        input: 'input',
        label: 'Título',
        placeholder: 'Guitarra Mela',
        formControlName: 'title',
        required: true,
      },
      {
        input: 'input',
        label: 'Descripción',
        placeholder: 'Guitarra Mela',
        formControlName: 'description',
        required: true,
      },
      {
        input: 'input',
        label: 'Precio',
        type: 'number',
        placeholder: '25000',
        formControlName: 'price',
        required: true,
      },
    ];
  }

  async onSubmit(): Promise<DocumentReference<any, DocumentData> | undefined> {
    try {
      const response = await this.productService.addProduct(
        this.productForm.value
      );
      this.updateProductId();
      this.openSnackBar(`El producto ha sido creado`, 'Cerrar');
      this.side.close();
      this.productForm.reset(); // Reinicia el formulario
      return response as DocumentReference<any, DocumentData>;
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      return undefined; // O null, dependiendo de lo que prefieras como valor de retorno en caso de error
    }
  }

  createSecondStep() {
    this.secondData = [
      {
        label: 'image',
        input: 'input',
        formControlName: 'image1',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image2',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image3',
      },
      {
        label: 'image',
        input: 'input',
        formControlName: 'image4',
      },
    ];
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 8,
    });
  }

  setColorOption(c: Color, inventoryItemIndex: number) {
    this.selectedColors[inventoryItemIndex] = c.hexa;
    const newColor = { ...c };
    const inventoryArray = this.productForm.get('inventory') as FormArray;
    const inventoryItem = inventoryArray.at(inventoryItemIndex) as FormGroup;
    inventoryItem.get('color')?.setValue(newColor);
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

  calculateTotalStock() {
    const inventory = this.productForm.get('inventory') as FormArray;
    let total = 0;
    for (let i = 0; i < inventory.length; i++) {
      total += inventory.at(i).get('count')?.value || 0;
    }
    this.productForm.get('control').get('totalStock')?.setValue(total);
  }

  async updateProductId() {
    try {
      const products = await this.productService.getDataFromCollection(
        'products'
      );
      const length = products.length;
      this.lengthOfAllProducts = length;
      this.productForm.get('id').setValue(length, { emitEvent: false });
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }
  /*   createInventoryItem(): FormGroup {
    return this.formBuilder.group({
      subRef: new FormControl('', [Validators.required]),
      stock: this.formBuilder.array([this.createStockItem()]),
      color: new FormGroup({
        name: new FormControl(''),
        hexa: new FormControl(''),
      }),
      count: new FormControl(0, [Validators.required, Validators.min(0)]),
      images: this.formBuilder.array([]),
    });
  } */

  get imagesOfItemProduct() {
    return this.productForm.get('inventory')?.get('images') as FormArray;
  }

  /*   createImageItem(): FormGroup {
    return this.formBuilder.group({
      url: new FormControl('', Validators.required),
      alt: new FormControl('', Validators.required),
    });
  } */

  addInventoryItem() {
    const inventory = this.productForm.get('inventory') as FormArray;
    inventory.push(this.createInventoryItem());
    this.calculateTotalStock();
  }

  addImageItem(index: number) {
    const inventory = this.productForm.get('inventory') as FormArray;
    const images = inventory.at(index).get('images') as FormArray;
    images.push(this.createImageItem());
  }

createInventoryItem(): FormGroup {
    return this.formBuilder.group({
        subRef: ['', [Validators.required]],
        color: new FormGroup({
          name: new FormControl(''),
          hexa: new FormControl(''),
        }),
        images: this.formBuilder.array([this.createImageItem()]),
        stock: this.formBuilder.array([this.createStockItem()]),
    });
}

createStockItem(): FormGroup {
  return this.formBuilder.group({
    size: [''],
    quantity: [''],
  });
}

addSizeItem(inventoryItemIndex: number) {
  this.getStockFormArray(inventoryItemIndex).push(this.createStockItem());
}

  get inventoryFormArray(): FormArray {
    return this.productForm.get('inventory') as FormArray;
  }

  getStockFormArray(inventoryItemIndex: number): FormArray {
    const inventoryItem = this.inventoryFormArray.at(inventoryItemIndex) as FormGroup;
    return inventoryItem.get('stock') as FormArray;
  }

  getImagesFormArray(inventoryItemIndex: number): FormArray {
    const inventoryItem = this.inventoryFormArray.at(inventoryItemIndex);
    if (inventoryItem) {
      return inventoryItem.get('images') as FormArray;
    } else {
      // Handle the case where the inventory item doesn't exist yet
      console.error(`Inventory item at index ${inventoryItemIndex} not found.`);
      return this.formBuilder.array([]); // Return an empty FormArray to avoid errors
    }
  }

  createImageItem(): FormGroup {
    return this.formBuilder.group({
      url: new FormControl( '' , Validators.required),
      alt: new FormControl('', Validators.required),
      progress: [0]
    });
  }

  async uploadFiles(event: any, inventoryItemIndex: number) {
    const files = event.target.files;
    const storage = getStorage();

    const controlRef = this.productForm.get('control.ref')?.value;
    const subRef = this.inventoryFormArray
      .at(inventoryItemIndex)
      ?.get('subRef')?.value;

    if (!controlRef || !subRef) {
      console.error('Control ref or sub ref is missing.');
      return; // Don't proceed if the necessary data is missing
    }

    const folderPath = `products/${controlRef}/${subRef}/`;

    for (const file of files) {
      const storageRef = ref(
        storage,
        `${folderPath}${Date.now()}-${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      const imageItem = this.createImageItem();
      this.getImagesFormArray(inventoryItemIndex).push(imageItem);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          imageItem.get('progress')?.setValue(progress);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            imageItem.get('url')?.setValue(downloadURL);
          });
        }
      );
    }

    this.fileInput.nativeElement.value = '';
  }

  addImageInput(inventoryItemIndex: number) {
    this.getImagesFormArray(inventoryItemIndex).push(this.createImageItem());
  }

  deleteImage(inventoryItemIndex: number, imageIndex: number) {
    this.getImagesFormArray(inventoryItemIndex).removeAt(imageIndex);
  }
}
