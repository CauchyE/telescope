import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockComponent } from './block.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BlockComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [BlockComponent],
})
export class BlockModule { }
