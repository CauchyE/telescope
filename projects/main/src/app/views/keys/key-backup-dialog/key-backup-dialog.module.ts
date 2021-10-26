import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyBackupDialogComponent } from './key-backup-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [KeyBackupDialogComponent],
  imports: [
    //Todo:必要なモジュールを絞る。
    CommonModule, FormsModule, MatCheckboxModule
  ],
  exports: [KeyBackupDialogComponent],
})
export class KeyBackupDialogModule { }
