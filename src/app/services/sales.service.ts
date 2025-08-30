import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id?: string;
  date: any;
  total: number;
  items: SaleItem[];
}

@Injectable({ providedIn: 'root' })
export class SalesService {
  private salesCollection: AngularFirestoreCollection<Sale>;

  constructor(private afs: AngularFirestore) {
    this.salesCollection = afs.collection<Sale>('sales');
  }

  getSales(): Observable<Sale[]> {
    return this.salesCollection.valueChanges({ idField: 'id' });
  }

  addSale(sale: Sale) {
    return this.salesCollection.add(sale);
  }

  deleteSale(id: string) {
    return this.salesCollection.doc(id).delete();
  }

  getSaleById(id: string): Observable<Sale | undefined> {
    return this.salesCollection.doc<Sale>(id).valueChanges({ idField: 'id' });
  }
}
