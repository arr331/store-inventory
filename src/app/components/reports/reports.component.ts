import { Component } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  totalRevenue: number = 0;
  totalSales: number = 0;

  constructor(private reportsService: ReportsService) {}

  loadReport() {
    this.reportsService.getSalesByMonth(this.selectedYear, this.selectedMonth)
      .subscribe(sales => {
        this.totalSales = sales.length;
        this.totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
      });
  }
}

