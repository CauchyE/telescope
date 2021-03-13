import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakingComponent } from './staking.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@view/material.module';

@NgModule({
  declarations: [StakingComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [StakingComponent],
})
export class StakingModule {}
