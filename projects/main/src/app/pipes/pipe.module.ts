import { DecimalsPipe } from './decimals.pipe';
import { FloorPipe } from './floor.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DecimalsPipe, FloorPipe],
  imports: [CommonModule],
  exports: [DecimalsPipe, FloorPipe],
})
export class PipeModule {}
