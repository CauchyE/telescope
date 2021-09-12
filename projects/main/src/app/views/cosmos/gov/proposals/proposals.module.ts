import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalsComponent } from './proposals.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material.module';



@NgModule({
  declarations: [
    ProposalsComponent
  ],
  imports: [
    CommonModule, RouterModule, FlexLayoutModule, MaterialModule
  ],
  exports: [
    ProposalsComponent
  ]
})
export class ProposalsModule { }
