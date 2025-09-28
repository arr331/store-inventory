import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { orderBy, query } from 'firebase/firestore';

export interface SaleItem {
  name: string;
  price: number;
  productId: string;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  date: any; // Timestamp de Firestore
  items: SaleItem[];
  total: number;
  totalSales: number;
  user: string;
}

export interface Liquidation {
  id: string;
  createdAt: any; // Timestamp de Firestore
  date: any;      // Timestamp de Firestore
  sales: Sale[];
  totalAmount: number;
  totalSales: number;
  user: string;
}

@Component({
  selector: 'app-liquidation-list',
  templateUrl: './liquidation-list.component.html',
  styleUrls: ['./liquidation-list.component.scss']
})
export class LiquidationListComponent {
  liquidations: Liquidation[] = [];
  selectedLiquidation: Liquidation | null = null;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadLiquidations();
  }

  loadLiquidations() {
    const ref = collection(this.firestore, 'liquidations');
    const q = query(ref, orderBy('createdAt', 'desc'));

    collectionData(q, { idField: 'id' }).subscribe(data => {
      this.liquidations = data as Liquidation[];
    });
  }

  selectLiquidation(liq: Liquidation) {
    this.selectedLiquidation = liq;
  }
}