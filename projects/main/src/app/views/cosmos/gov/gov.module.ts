import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovComponent } from './gov.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [
    GovComponent
  ],
  imports: [
    CommonModule, RouterModule, FlexLayoutModule, MaterialModule
  ],
  exports: [
    GovComponent
  ],
})
export class GovModule { }
