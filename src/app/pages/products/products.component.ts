import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  @ViewChild('barcodeInput') barcodeInput!: ElementRef;

  ngAfterViewInit(): void {
    this.barcodeInput.nativeElement.focus();
  }

  products: Product[] = [];
  newProduct: Product = { barcode: '', name: '', purchasePrice: 0, salePrice: 0, stock: 0, category: '' };
  editMode = false;
  selectedProductId: string | null = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
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

  deleteProduct(id: string): void {
    this.productsService.deleteProduct(id);
  }

  resetForm(): void {
    this.newProduct = { barcode: '', name: '', purchasePrice: 0, salePrice: 0, stock: 0, category: '' };
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
      this.newProduct = { ...this.newProduct, name: '', purchasePrice: 0, salePrice: 0, stock: 0, category: '' };
    }
  }
  
}
