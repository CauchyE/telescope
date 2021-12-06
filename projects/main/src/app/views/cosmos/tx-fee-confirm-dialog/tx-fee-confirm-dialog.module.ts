import { MaterialModule } from '../../material.module';
import { TxFeeConfirmDialogComponent } from './tx-fee-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxFeeConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [TxFeeConfirmDialogComponent],
})
export class TxFeeConfirmDialogModule {}
