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
  endDate?: Date | null;

  @Input()
  dataArray?: Data[] | null;

  @Output()
  searchCriteriaChanged = new EventEmitter<{ startDate: Date; endDate: Date }>();

  constructor() {}

  ngOnInit(): void {}

  onSubmit(startDate: Date, endDate: Date) {
    this.searchCriteriaChanged.emit({
      startDate,
      endDate,
    });
  }
}
