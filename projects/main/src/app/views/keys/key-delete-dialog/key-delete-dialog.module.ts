import { MaterialModule } from '../../material.module';
import { KeyDeleteDialogComponent } from './key-delete-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [KeyDeleteDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [KeyDeleteDialogComponent],
})
export class KeyDeleteDialogModule {}
