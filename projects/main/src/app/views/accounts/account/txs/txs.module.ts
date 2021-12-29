import { MaterialModule } from '../../../material.module';
import { TxsComponent } from './txs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TxsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [TxsComponent],
})
export class TxsModule {}
