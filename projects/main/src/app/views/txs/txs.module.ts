import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxsComponent } from './txs.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TxsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    TxsComponent
  ]
})
export class TxsModule { }
