import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorComponent } from './validator.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../../../view/material.module';

@NgModule({
  declarations: [ValidatorComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [ValidatorComponent],
})
export class ValidatorModule { }
