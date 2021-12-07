import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovComponent } from './gov.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [
    GovComponent
  ],
  imports: [
    CommonModule, RouterModule, MaterialModule
  ],
  exports: [
    GovComponent
  ],
})
export class GovModule { }
