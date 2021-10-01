import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  data$: Observable<Data[]>;
  startDate$: BehaviorSubject<Date>;
  count$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.startDate$ = new BehaviorSubject(yesterday);
    this.data$ = combineLatest([this.startDate$.asObservable(), this.count$.asObservable()]).pipe(
      mergeMap(([start, count]) =>
        this.monitor.list(start.getFullYear(), start.getMonth() + 1, start.getDate(), count),
      ),
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );
  }

  ngOnInit(): void {}

  appStartParamChanged(startDate: Date): void {
    this.startDate$.next(startDate);
  }

  appCountParamChanged(count: number): void {
    if (count !== null) {
      this.count$.next(count);
    }
  }
}
