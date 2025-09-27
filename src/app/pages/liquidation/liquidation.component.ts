// src/app/liquidation/liquidation.component.ts
import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.scss']
})
export class LiquidationComponent implements OnInit {
  users: any[] = [];
  selectedUser: string = '';
  selectedDate: string = new Date().toISOString().substring(0, 10);

  pendingSales: any[] = [];
  previousLiquidations: any[] = [];

  constructor(
    private salesService: SalesService,
    private usersService: UsersService
  ) {}

  async ngOnInit() {
    this.users = await this.usersService.getUsers();
  }

  async searchSales() {
    if (!this.selectedUser || !this.selectedDate) return;
    const date = new Date(this.selectedDate + "T00:00:00");
    this.pendingSales = await this.salesService.getPendingSales(this.selectedUser, date);
    this.previousLiquidations = await this.salesService.getLiquidations(this.selectedUser, date);
  }

  async liquidate() {
    if (!this.pendingSales.length) {
      alert("No pending sales to liquidate");
      return;
    }

    this.selectedUser = this.pendingSales[0].user;
    const user = this.users.find(u => u.id === this.selectedUser);
    await this.salesService.liquidateSales(user?.name || '', this.pendingSales, new Date(this.selectedDate + "T00:00:00"));

    alert("Liquidation registered ✅");
    await this.searchSales(); // refresh tables
  }
}
