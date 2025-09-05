import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, docData } from '@angular/fire/firestore';
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
  user: string;
}

@Injectable({ providedIn: 'root' })
export class SalesService {
  private firestore: Firestore = inject(Firestore);
  private salesCollection = collection(this.firestore, 'sales');

  getSales(): Observable<Sale[]> {
    return collectionData(this.salesCollection, { idField: 'id' }) as Observable<Sale[]>;
  }

  addSale(sale: Sale) {
    return addDoc(this.salesCollection, sale);
  }

  deleteSale(id: string) {
    const saleDoc = doc(this.firestore, `sales/${id}`);
    return deleteDoc(saleDoc);
  }

  getSaleById(id: string): Observable<Sale | undefined> {
    const saleDoc = doc(this.firestore, `sales/${id}`);
    return docData(saleDoc, { idField: 'id' }) as Observable<Sale | undefined>;
  }
}

