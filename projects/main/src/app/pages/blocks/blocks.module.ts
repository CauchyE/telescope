import { BlockModule } from '../../views/blocks/block/block.module';
import { BlockComponent } from './block/block.component';
import { BlocksRoutingModule } from './blocks-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlocksComponent } from './blocks.component';
import { BlocksModule } from '../../views/blocks/blocks.module';

@NgModule({
  declarations: [BlockComponent, BlocksComponent],
  imports: [CommonModule, BlocksRoutingModule, BlockModule, BlocksModule],
})
export class AppBlocksModule {}
