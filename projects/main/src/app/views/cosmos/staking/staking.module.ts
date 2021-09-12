import { MaterialModule } from '../../../views/material.module';
import { StakingComponent } from './staking.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [StakingComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [StakingComponent],
})
export class StakingModule {}
