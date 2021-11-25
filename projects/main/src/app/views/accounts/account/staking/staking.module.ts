import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakingComponent } from './staking.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [StakingComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [StakingComponent],
})
export class StakingModule { }
