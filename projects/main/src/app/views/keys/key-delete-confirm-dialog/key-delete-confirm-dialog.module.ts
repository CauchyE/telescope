import { MaterialModule } from '../../material.module';
import { KeyDeleteConfirmDialogComponent } from './key-delete-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [KeyDeleteConfirmDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [KeyDeleteConfirmDialogComponent],
})
export class KeyDeleteConfirmDialogModule {}
