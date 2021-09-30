import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  data: Observable<Data[]>;
  startDate$: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  count$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    this.data = combineLatest([this.startDate$.asObservable(), this.count$.asObservable()]).pipe(
      mergeMap(([start, count]) =>
        this.monitor.list(start.getFullYear(), start.getMonth(), start.getDate(), count),
      ),
    );
  }

  ngOnInit(): void {}

  appStartParamChanged(startDate: Date): void {
    this.startDate$.next(startDate);
    this.data = combineLatest([this.startDate$.asObservable(), this.count$.asObservable()]).pipe(
      mergeMap(([start, count]) =>
        this.monitor.list(start.getFullYear(), start.getMonth(), start.getDate(), count),
      ),
    );
  }
  appCountParamChanged(count: number): void {
    this.count$.next(count);
    this.data = combineLatest([this.startDate$.asObservable(), this.count$.asObservable()]).pipe(
      mergeMap(([start, count]) =>
        this.monitor.list(start.getFullYear(), start.getMonth(), start.getDate(), count),
      ),
    );
  }
}
