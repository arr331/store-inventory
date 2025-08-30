import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Sale } from '../services/sales.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private afs: AngularFirestore) {}

  getSalesByMonth(year: number, month: number): Observable<Sale[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.afs.collection<Sale>('sales', ref =>
      ref.where('date', '>=', startDate)
         .where('date', '<=', endDate)
    ).valueChanges({ idField: 'id' });
  }
}

