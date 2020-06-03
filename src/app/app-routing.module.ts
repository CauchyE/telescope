import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'accounts/:address',
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'txs/:tx_hash',
    loadChildren: () => import('./txs/txs.module').then((m) => m.TxsModule),
  },
  {
    path: 'validators',
    loadChildren: () =>
      import('./validators/validators.module').then((m) => m.ValidatorsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
