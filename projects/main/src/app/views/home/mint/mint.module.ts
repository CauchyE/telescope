import { PipeModule } from '../../../pipes/pipe.module';
import { MaterialModule } from '../../material.module';
import { MintComponent } from './mint.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MintComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipeModule],
  exports: [MintComponent],
})
export class MintModule {}
