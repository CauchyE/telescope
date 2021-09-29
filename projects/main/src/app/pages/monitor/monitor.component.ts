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
    const today = new Date(); // 変数が呼ばれた時の日時がDate型で取得できる
    const year = today.getFullYear(); // 2019とかを取得できる
    const month = today.getMonth(); // 月は0~11の値で管理されているというトラップ
    const date = today.getDate(); // 日付は普通に1~の数字で管理されている
    this.data = this.monitor.list(year, month, date, 1);
    this.data.then((d) => console.log(d));
  }

  ngOnInit(): void {}
}
