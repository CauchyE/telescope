import { Data } from '../../models/monitor.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  @Input()
  startDate?: Date | null;

  @Input()
  count?: number | null;

  @Input()
  data?: Data[] | null;

  @Output()
  startParamChanged: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  countParamChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onStartParamChanged(startDate: Date): void {
    this.startParamChanged.emit(startDate);
  }
  onCountParamChanged(count: number): void {
    this.countParamChanged.emit(count);
  }
}
