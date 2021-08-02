import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { BlockComponent } from './block/block.component';
import { BlockModule } from '../../view/blocks/block/block.module';


@NgModule({
  declarations: [
    BlockComponent
  ],
  imports: [
    CommonModule,
    BlocksRoutingModule,
    BlockModule
  ]
})
export class AppBlocksModule { }
