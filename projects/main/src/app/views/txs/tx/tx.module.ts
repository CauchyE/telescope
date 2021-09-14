import { MaterialModule } from '../../../views/material.module';
import { TxComponent } from './tx.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, MaterialModule],
  exports: [TxComponent],
})
export class TxModule {}
