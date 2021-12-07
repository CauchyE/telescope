import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalsComponent } from './proposals.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';



@NgModule({
  declarations: [
    ProposalsComponent
  ],
  imports: [
    CommonModule, RouterModule, MaterialModule
  ],
  exports: [
    ProposalsComponent
  ]
})
export class ProposalsModule { }
