import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TxsRoutingModule } from './txs-routing.module';
import { TxComponent } from './tx/tx.component';
import { TxModule } from '../../view/txs/tx/tx.module';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, TxsRoutingModule, TxModule],
})
export class AppTxsModule { }
