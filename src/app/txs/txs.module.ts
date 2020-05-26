import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TxsRoutingModule } from './txs-routing.module';
import { TxComponent } from './tx/tx.component';
import { TxsViewModule } from '@view/txs/txs.module';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, TxsRoutingModule, TxsViewModule],
})
export class TxsModule {}
