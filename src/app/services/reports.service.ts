import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Sale } from '../services/sales.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private firestore: Firestore = inject(Firestore);

  getSalesByMonth(year: number, month: number): Observable<Sale[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const salesCollection = collection(this.firestore, 'sales');
    const salesQuery = query(
      salesCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    return collectionData(salesQuery, { idField: 'id' }) as Observable<Sale[]>;
  }
}

