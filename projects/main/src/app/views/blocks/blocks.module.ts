import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [
    BlocksComponent
  ],
  imports: [
    CommonModule, MaterialModule, RouterModule, FlexLayoutModule
  ],
  exports: [
    BlocksComponent
  ]
})
export class BlocksModule { }
