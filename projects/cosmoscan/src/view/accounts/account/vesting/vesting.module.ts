import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VestingComponent } from './vesting.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material.module';

@NgModule({
  declarations: [VestingComponent],
  imports: [CommonModule, RouterModule, FlexLayoutModule, MaterialModule],
  exports: [VestingComponent],
})
export class VestingModule { }
