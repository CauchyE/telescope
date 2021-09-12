import { MaterialModule } from '../../../views/material.module';
import { KeyComponent } from './key.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [KeyComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [KeyComponent],
})
export class KeyModule {}
