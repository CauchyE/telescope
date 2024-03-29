import { PipeModule } from '../../../../../pipes/pipe.module';
import { MaterialModule } from '../../../../../views/material.module';
import { ValidatorComponent } from './validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ValidatorComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipeModule],
  exports: [ValidatorComponent],
})
export class ValidatorModule {}
