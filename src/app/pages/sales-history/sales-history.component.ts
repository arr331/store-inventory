import { Component, OnInit } from '@angular/core';
import { SalesService, Sale } from '../../services/sales.service';
import { ProductsService } from '../../services/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html'
})
export class SalesHistoryComponent implements OnInit {
  sales: Sale[] = [];

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.salesService.getSales().subscribe(data => {
      this.sales = data;
    });
  }

  async cancelSale(sale: Sale): Promise<void> {
    if (!confirm('Are you sure you want to cancel this sale?')) return;
  
    for (const item of sale.items) {
      const product = await firstValueFrom(this.productsService.getProductById(item.productId));
  
      if (product) {
        await this.productsService.updateProduct(product.id!, {
          stock: product.stock + item.quantity
        });
      }
    }
  
    // Delete sale from DB
    await this.salesService.deleteSale(sale.id!);
  }
}
