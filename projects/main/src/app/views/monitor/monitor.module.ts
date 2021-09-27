import { MaterialModule } from '../material.module';
import { MonitorComponent } from './monitor.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MonitorComponent],
  imports: [CommonModule, FlexLayoutModule, MaterialModule],
  exports: [MonitorComponent],
})
export class MonitorModule {}
