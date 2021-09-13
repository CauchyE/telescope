import { BlockModule } from '../../views/blocks/block/block.module';
import { BlockComponent } from './block/block.component';
import { BlocksRoutingModule } from './blocks-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlockComponent],
  imports: [CommonModule, BlocksRoutingModule, BlockModule],
})
export class AppBlocksModule {}
