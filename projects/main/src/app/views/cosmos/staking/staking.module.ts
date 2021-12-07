import { MaterialModule } from '../../../views/material.module';
import { StakingComponent } from './staking.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [StakingComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [StakingComponent],
})
export class StakingModule { }
