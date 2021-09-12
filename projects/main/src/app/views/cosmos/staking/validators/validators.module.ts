import { MaterialModule } from '../../../../views/material.module';
import { ValidatorsComponent } from './validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ValidatorsComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [ValidatorsComponent],
})
export class ValidatorsModule {}
