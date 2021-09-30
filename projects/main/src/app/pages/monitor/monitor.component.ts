import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  data: Promise<Data[]>;
  startDate: Date;
  count: number;

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
    this.count = 1;

    const year = this.startDate.getFullYear();
    const month = this.startDate.getMonth() + 1;
    const day = this.startDate.getDate();
    this.data = this.monitor.list(year, month, day, this.count);
  }

  ngOnInit(): void {}
}
