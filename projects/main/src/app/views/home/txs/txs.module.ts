import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxsComponent } from './txs.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TxsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [TxsComponent],
})
export class TxsModule { }
