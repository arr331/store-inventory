import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'sales-history', component: SalesHistoryComponent },
  { path: 'reports', component: ReportsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
