import { MaterialModule } from '../../material.module';
import { KeyBackupDialogComponent } from './key-backup-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [KeyBackupDialogComponent],
  imports: [CommonModule, MaterialModule, MatStepperModule],
  exports: [KeyBackupDialogComponent],
})
export class KeyBackupDialogModule { }
