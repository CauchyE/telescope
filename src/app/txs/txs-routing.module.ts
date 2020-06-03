import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TxComponent } from './tx/tx.component';

const routes: Routes = [{ path: '', component: TxComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TxsRoutingModule { }
