import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeInputRef') barcodeInput!: ElementRef;

  ngAfterViewInit(): void {
    this.barcodeInput.nativeElement.focus();
  }

  products: Product[] = [];
  newProduct: Product = { barcode: '', name: '', purchasePrice: 0, salePrice: 0, stock: 0, id: '' };
  editMode = false;
  selectedProductId: string | null = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products = data.sort((a, b) => a.stock - b.stock);this.products = data;
    });
  }

  addProduct(): void {
    if (this.editMode && this.selectedProductId) {
      this.productsService.updateProduct(this.selectedProductId, this.newProduct).then(() => {
        this.resetForm();
      });
    } else {
      this.productsService.addProduct(this.newProduct).then(() => {
        this.resetForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.newProduct = { ...product };
    this.selectedProductId = product.id || null;
    this.editMode = true;
  }
  
  onPriceChange(value: string) {
    // quitar símbolos y comas, luego convertir a número
    const cleanValue = value.replace(/[^0-9]/g, '');
    this.newProduct.purchasePrice = Number(cleanValue);
  }

  deleteProduct(id: string | null, fromForm: boolean = false): void {
    if (id == null) return;
    if (!confirm('¿Seguro quiere eliminar este producto?')) return;

    this.productsService.deleteProduct(id);
    if (fromForm) this.resetForm();
  }

  resetForm(): void {
    this.newProduct = { barcode: '', name: '', purchasePrice: 0, salePrice: 0, stock: 0, id: '' };
    this.editMode = false;
    this.selectedProductId = null;
    setTimeout(() => this.barcodeInput.nativeElement.focus(), 0);
  }

  onBarcodeScanned(): void {
    const existingProduct = this.products.find(
      p => p.barcode.trim() === this.newProduct.barcode.trim()
    );
  
    if (existingProduct) {
      this.editProduct(existingProduct);
    } else {
      this.editMode = false;
      this.selectedProductId = null;
      this.newProduct = { ...this.newProduct, name: '', purchasePrice: 0, salePrice: 0, stock: 0, id: '' };
    }
  }

  buttonDisable() {
    return this.newProduct.barcode == null || this.newProduct.barcode.trim() == ""
    || this.newProduct.name == null || this.newProduct.name.trim() == ""
    || this.newProduct.purchasePrice == null || this.newProduct.purchasePrice < 0
    || this.newProduct.salePrice == null || this.newProduct.salePrice < 0
    || this.newProduct.stock == null || this.newProduct.stock < 0;
  }
  
}
