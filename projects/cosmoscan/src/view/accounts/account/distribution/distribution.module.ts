import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionComponent as DistributionComponent } from './distribution.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [DistributionComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [DistributionComponent],
})
export class DistributionModule { }
