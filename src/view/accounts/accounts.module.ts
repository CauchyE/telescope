import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AccountComponent } from './account/account.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatTableModule],
  exports: [AccountComponent],
})
export class AccountsViewModule { }
