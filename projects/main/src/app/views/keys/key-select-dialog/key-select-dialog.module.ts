import { MaterialModule } from '../../../views/material.module';
import { KeySelectDialogComponent } from './key-select-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [KeySelectDialogComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [KeySelectDialogComponent],
})
export class KeySelectDialogModule {}
