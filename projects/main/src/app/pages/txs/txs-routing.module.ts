import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TxsComponent } from './txs.component';
import { TxComponent } from './tx/tx.component';

const routes: Routes = [
  {
    path: '',
    component: TxsComponent
  },
  {
    path: ':tx_hash',
    component: TxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TxsRoutingModule { }
