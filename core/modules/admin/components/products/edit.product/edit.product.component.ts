import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
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
} from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import {
  uploadBytesResumable,
  getStorage,
  ref,
  getDownloadURL,
} from 'firebase/storage';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Product } from '../../../interface/products';

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
  selector: ' bel-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT,
  ],
  templateUrl: './edit.product.component.html',
  styleUrl: './edit.product.component.scss',
})
export class EditProductComponent {
  colors!: Color[];
  color!: Color;
  selectedColors: { [inventoryIndex: number]: string } = {}; // Objeto para almacenar colores seleccionados por índice
  sizes!: { name: string }[];
  size!: { name: string };
  lengthOfAllProducts!: number;
  @Output() stepperIndexChange = new EventEmitter<number>(); // index of mat-step
  @Output() formSubmit = new EventEmitter<FormGroup>(); // form data
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private _selectedProduct!: Product;
  @Input()
  set selectedProduct(value: Product) {
    if (value) {
      this._selectedProduct = value;
      // Cuando tengamos el form inicializado, procedemos a rellenarlo
      this.patchFormWithSelectedProduct(value);
    }
  }

  get selectedProduct(): Product {
    return this._selectedProduct;
  }

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
        ref: [''],
        totalStock: [''],
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

  patchFormWithSelectedProduct(product: Product): void {
    if (!this.productForm) return;

    // Reinicia el formulario para evitar datos "viejos"
    this.productForm.reset();

    // Limpia el FormArray de 'inventory'
    const inventoryFormArray = this.productForm.get('inventory') as FormArray;
    inventoryFormArray.clear();

    // Parchea los valores simples de nivel superior
    this.productForm.patchValue({
      id: product.id,
      category: product.category ?? [''],
      subcategory: product.subcategory ?? [''],
      slug: product.slug,
      title: product.title,
      description: product.description,
      price: product.price,
      characteristics: {
        height: product.characteristics.height,
        broad: product.characteristics.broad ?? '',
        weight: product.characteristics.weight,
      },
      control: {
        ref: product.control.ref,
        totalStock: product.control.totalStock,
      },
    });

    // Parchear INVENTORY
    // Verifica que tengas un array válido en product.inventory
    if (product.inventory && product.inventory.length > 0) {
      product.inventory.forEach((inv) => {
        // 1) Crear un FormGroup usando tu método createInventoryItem()
        const inventoryGroup = this.createInventoryItem();

        // 2) Asignar los valores del inventory actual
        // subRef
        inventoryGroup.patchValue({
          subRef: inv.subRef,
          color: inv.color, // <-- color: { name, hexa }
        });

        // STOCK: limpiamos el formArray stock y creamos uno por cada item
        const stockFormArray = inventoryGroup.get('stock') as FormArray;
        stockFormArray.clear();
        if (inv.stock && inv.stock.length > 0) {
          inv.stock.forEach((stockItemData) => {
            const stockItem = this.createStockItem();
            stockItem.patchValue({
              size: stockItemData.size,
              quantity: stockItemData.quantity,
            });
            stockFormArray.push(stockItem);
          });
        }

        // IMAGES: limpiamos el formArray images y creamos uno por cada item
        const imagesFormArray = inventoryGroup.get('images') as FormArray;
        imagesFormArray.clear();
        if (inv.images && inv.images.length > 0) {
          inv.images.forEach((img) => {
            const imageItem = this.createImageItem();
            imageItem.patchValue({
              url: img.url,
              alt: img.alt,
              // progress lo dejas en 0 (o lo que necesites)
            });
            imagesFormArray.push(imageItem);
          });
        }

        // 3) Finalmente, se agrega este group al FormArray principal
        inventoryFormArray.push(inventoryGroup);
      });
    }
  }


  // Control de botones inicio

  nextStep() {
    this.stepperIndexChange.emit(this.stepper.selectedIndex + 1);
    this.stepper.next();
  }

  previousStep() {
    if (this.stepper.selectedIndex > 0) {
      // Only allow going back if not on the first step
      this.stepperIndexChange.emit(this.stepper.selectedIndex - 1);
      this.stepper.previous();
    }
  }

  submitForm() {
    if (this.productForm.valid) {
      const formValue = { ...this.productForm.value };
      formValue.price = formValue.price.replace(/\D/g, ''); // Limpiar formato para enviar solo números
      this.productService.addProduct(formValue).then(() => {
      });
    } else {
    }
  }

  updateExistingProduct() {
    if (this.productForm.valid) {
      // Aquí docId debe ser la cadena real de Firestore
      const docId = this.productForm.value.id;

      const changes: Partial<Product> = this.productForm.value;

      // Método "updateProduct" de tu servicio (ej. usando updateDoc)
      this.productService.updateProduct(docId, changes)
        .then(() => {
          this.openSnackBar('Producto actualizado', 'Cerrar');
        })
        .catch((err) => console.error('Error al actualizar:', err));
    }
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

  // Control de botones Fin

  createFirstStep() {
    this.firstData = [
      {
        input: 'input',
        label: 'Título',
        placeholder: 'Guitarra Mela',
        formControlName: 'title',
        type: 'text',
        required: true,
      },
      {
        input: 'input',
        label: 'Descripción',
        placeholder: 'Descripción del producto',
        formControlName: 'description',
        type: 'text',
        required: true,
      },
      {
        input: 'input',
        label: 'Precio',
        placeholder: '30000',
        formControlName: 'price',
        type: 'text', // Asegurarse de que sea "text"
        required: true,
      },
    ];
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

    dialogRef.afterClosed().subscribe((result: Color | undefined) => {
      if (result) {
        // Solo actúa si hay un resultado (el color creado)
        this.colors.push(result); // Añade el nuevo color a la lista
        this.openSnackBar(`El Color ${result.name} ha sido creado`, 'Cerrar');
      }
    });
  }

  deleteColor(index: number, id: string): void {
    this.configurationColorService
      .deleteColor(id)
      .then(() => {
        this.colors.splice(index, 1); // Elimina el color del array local
        this.openSnackBar('Color eliminado con éxito', 'Cerrar');
      })
      .catch((error) => {
        console.error('Error eliminando el color:', error);
        this.openSnackBar('Error eliminando el color', 'Cerrar');
      });
  }

  openCreateSizeDialog(): void {
    const dialogRef = this.dialog.open(CreateSizeComponent, {
      data: this.color, // Si no necesitas pasar datos, puedes dejarlo vacío
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.configurationSizeService
          .getSizeFromCollection()
          .then((sizes) => {
            this.sizes = sizes; // Actualiza la lista de tamaños con los datos más recientes
            this.openSnackBar(
              `El Tamaño ${result.name} ha sido creado`,
              'Cerrar'
            );
          })
          .catch((error) => {
            console.error('Error al actualizar la lista de tamaños:', error);
          });
      }
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
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

  get imagesOfItemProduct() {
    return this.productForm.get('inventory')?.get('images') as FormArray;
  }

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
    const inventoryItem = this.inventoryFormArray.at(
      inventoryItemIndex
    ) as FormGroup;
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
      url: new FormControl(''),
      alt: new FormControl(''),
      progress: [0],
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
