// src/app/liquidation/liquidation.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
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
  selectedDate: string = new Date().toLocaleDateString('sv-SE');
  loading = false;
  success = false;

  pendingSales: any[] = [];
  previousLiquidations: any[] = [];

  constructor(
    private salesService: SalesService,
    private usersService: UsersService,
    public authService: AuthService,
  ) {}

  async ngOnInit() {
    this.users = await this.usersService.getUsers();
    this.selectedUser = "ventas";
    this.searchSales();
  }

  async searchSales() {
    if (!this.selectedUser || !this.selectedDate) return;
    this.loading = true;
    const date = new Date(this.selectedDate + "T00:00:00");
    this.pendingSales = await this.salesService.getPendingSales(this.selectedUser, date);
    this.previousLiquidations = await this.salesService.getLiquidations(this.selectedUser, date);
    this.loading = false;
  }

  async liquidate() {
    if (!this.pendingSales.length) {
      alert("No hay ventas a liquidar");
      return;
    }

    if (!confirm('¿Seguro quiere liquidar caja?')) return;

    this.selectedUser = this.pendingSales[0].user;
    const user = this.users.find(u => u.name === this.selectedUser);
    await this.salesService.liquidateSales(user?.name || '', this.pendingSales, new Date(this.selectedDate + "T00:00:00"));

    this.successMessage();
    await this.searchSales(); // refresh tables
  }

  totalEnCaja(): number {
    return this.pendingSales.reduce((acc, s: any) => acc + s.total, 0);
  }

  isAdmin() {
    const role = this.authService.getRole();
    return role === 'admin';
  }


  successMessage() {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 2000); // se oculta automático en 2s
  }
}
