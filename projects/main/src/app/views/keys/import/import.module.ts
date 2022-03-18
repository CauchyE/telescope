import { MaterialModule } from '../../../views/material.module';
import { ImportComponent } from './import.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ImportComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, ClipboardModule],
  exports: [ImportComponent],
})
export class ImportModule {}
