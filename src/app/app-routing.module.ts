import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { SalesHistoryComponent } from './pages/sales-history/sales-history.component';
import { SalesComponent } from './pages/sales/sales.component';
import { ReportsComponent } from './components/reports/reports.component';
import { adminGuard, authGuard } from './services/auth.service';
import { LoginComponent } from './pages/login/login.component';
import { LiquidationComponent } from './pages/liquidation/liquidation.component';
import { LiquidationListComponent } from './pages/liquidation-list/liquidation-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'inventario', component: ProductsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'vender', component: SalesComponent, canActivate: [authGuard] },
  { path: 'historial', component: SalesHistoryComponent, canActivate: [authGuard, adminGuard] },
  { path: 'reportes', component: ReportsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'balance', component: LiquidationComponent, canActivate: [authGuard] },
  { path: 'liquidaciones', component: LiquidationListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'vender', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
