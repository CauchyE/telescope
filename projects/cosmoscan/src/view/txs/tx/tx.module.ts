import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxComponent } from './tx.component';
import { MaterialModule } from '../../../view/material.module';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, MaterialModule],
  exports: [TxComponent],
})
export class TxModule { }
