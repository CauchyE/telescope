import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxComponent } from './tx/tx.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatTableModule],
  exports: [TxComponent],
})
export class TxsViewModule { }
