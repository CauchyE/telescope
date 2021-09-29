import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  data: Promise<Data[]>;

  constructor(private readonly monitor: MonitorService) {
    this.data = this.monitor.list(2021, 9, 28, 1);
    this.data.then((d) => console.log(d));
  }

  ngOnInit(): void {}
}
