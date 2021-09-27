import { MonitorModule } from '../../views/monitor/monitor.module';
import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorComponent } from './monitor.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MonitorComponent],
  imports: [CommonModule, MonitorRoutingModule, MonitorModule],
})
export class AppMonitorModule {}
