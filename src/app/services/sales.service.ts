import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, docData, query, where, writeBatch, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

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

    // Get pending sales by user and date
    async getPendingSales(name: string, date: Date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
    
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);      
    
      const q = query(
        collection(this.firestore, 'sales'),
        where('user', '==', name),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );
    
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  
    // Perform liquidation
    async liquidateSales(user: string, sales: any[], date: Date) {
      if (!sales.length) throw new Error("No pending sales");
  
      const totalAmount = sales.reduce((acc, s: any) => acc + s.total, 0);
  
      const liquidation = {
        user,
        createdAt: new Date(),
        date: Timestamp.fromDate(date),
        totalSales: sales.length,
        totalAmount,
        sales: sales
      };
  
      const liquidationsRef = collection(this.firestore, 'liquidations');
      const docRef = await addDoc(liquidationsRef, liquidation);
  
      this.deleteSales(sales);
  
      return docRef.id;
    }

    async deleteSales(sales: any[]) {
      const batch = writeBatch(this.firestore);
    
      for (let s of sales) {
        const ref = doc(this.firestore, 'sales', s.id);
        batch.delete(ref);
      }
    
      await batch.commit();
    }
  
    // Get previous liquidations
    async getLiquidations(user: string, date: Date) {
      console.log("liquidaciones")
      console.log(user, date);
      const startOfDay = new Date(date.setHours(0,0,0,0));
      const endOfDay = new Date(date.setHours(23,59,59,999));
  
      const q = query(
        collection(this.firestore, 'liquidations'),
        where('user', '==', user),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
      );
  
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

