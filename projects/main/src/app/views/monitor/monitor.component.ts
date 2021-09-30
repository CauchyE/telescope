import { Data } from '../../models/monitor.service';
import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}
}
