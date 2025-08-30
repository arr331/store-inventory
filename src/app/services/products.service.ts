import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  barcode: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = afs.collection<Product>('products');
  }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  addProduct(product: Product) {
    return this.productsCollection.add(product);
  }

  updateProduct(id: string, data: Partial<Product>) {
    return this.productsCollection.doc(id).update(data);
  }

  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }
 
  getProductById(id: string): Observable<Product | undefined> {
    return this.productsCollection.doc<Product>(id).valueChanges({ idField: 'id' });
  }
  
}
