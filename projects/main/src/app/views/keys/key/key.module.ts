import { MaterialModule } from '../../../views/material.module';
import { KeyComponent } from './key.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [KeyComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [KeyComponent],
})
export class KeyModule { }
