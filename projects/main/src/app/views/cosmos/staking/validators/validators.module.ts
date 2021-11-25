import { MaterialModule } from '../../../../views/material.module';
import { ValidatorsComponent } from './validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ValidatorsComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [ValidatorsComponent],
})
export class ValidatorsModule { }
