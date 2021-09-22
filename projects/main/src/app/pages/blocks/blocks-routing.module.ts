import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocksComponent } from './blocks.component';
import { BlockComponent } from './block/block.component';

const routes: Routes = [
  {
    path: '',
    component: BlocksComponent
  },
  {
    path: ':block_height',
    component: BlockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlocksRoutingModule { }
