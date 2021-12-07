import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionComponent as DistributionComponent } from './distribution.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [DistributionComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [DistributionComponent],
})
export class DistributionModule { }
