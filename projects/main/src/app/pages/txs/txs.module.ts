import { TxModule } from '../../views/txs/tx/tx.module';
import { TxComponent } from './tx/tx.component';
import { TxsRoutingModule } from './txs-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, TxsRoutingModule, TxModule],
})
export class AppTxsModule {}
