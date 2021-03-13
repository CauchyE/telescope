import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeySelectDialogComponent } from './key-select-dialog.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@view/material.module';

@NgModule({
  declarations: [KeySelectDialogComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
})
export class KeySelectDialogModule {}
