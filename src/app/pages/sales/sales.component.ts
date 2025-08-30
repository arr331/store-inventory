import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../../services/products.service';
import { SalesService, Sale, SaleItem } from '../../services/sales.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
  products: Product[] = [];
  cart: SaleItem[] = [];
  barcodeInput = '';
  total = 0;

  constructor(
    private productsService: ProductsService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  onBarcodeScanned(): void {
    const product = this.products.find(
      p => p.barcode.trim() === this.barcodeInput.trim()
    );

    if (product) {
      this.addToCart(product);
    }

    this.barcodeInput = '';
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(i => i.productId === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        productId: product.id!,
        name: product.name,
        quantity: 1,
        price: product.salePrice
      });
    }
    this.updateTotal();
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  completeSale(): void {
    if (this.cart.length === 0) return;

    const sale: Sale = {
      date: Timestamp.now(),
      total: this.total,
      items: this.cart
    };

    this.salesService.addSale(sale).then(() => {
      this.cart.forEach(item => {
        const product = this.products.find(p => p.id === item.productId);
        if (product) {
          this.productsService.updateProduct(product.id!, {
            stock: product.stock - item.quantity
          });
        }
      });
      this.cart = [];
      this.total = 0;
    });
  }
}

