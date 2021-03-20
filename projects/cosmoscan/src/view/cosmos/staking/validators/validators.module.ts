import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../../view/material.module';
import { ValidatorsComponent } from './validators.component';

@NgModule({
  declarations: [ValidatorsComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [ValidatorsComponent],
})
export class ValidatorsModule { }
