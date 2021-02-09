import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelegatorComponent } from './delegator.component';

@NgModule({
  declarations: [DelegatorComponent],
  imports: [CommonModule],
  exports: [DelegatorComponent],
})
export class DelegatorModule {}
