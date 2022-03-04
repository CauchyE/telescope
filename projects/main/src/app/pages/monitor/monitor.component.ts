import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  dataArray$: Observable<Data[]>;
  dateRange$: BehaviorSubject<[Date, Date]>;
  startDate$: Observable<Date>;
  endDate$: Observable<Date>;
  // count$: Observable<number>;

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    this.dateRange$ = new BehaviorSubject([yesterday, now]);
    const dateRangeMinus1$ = this.dateRange$;
    this.startDate$ = this.dateRange$.pipe(map(([start, end]) => start));
    this.endDate$ = this.dateRange$.pipe(map(([start, end]) => end));
    this.dataArray$ = dateRangeMinus1$.pipe(
      map(([start, end]) => {
        const count = Math.ceil(((end as any) - (start as any)) / 86400000) + 1;

        return [start, end, count] as [Date, Date, number];
      }),
      mergeMap(([start, end, count]) =>
        this.monitor
          .list(start.getFullYear(), start.getMonth() + 1, start.getDate(), count)
          .pipe(map((list) => [start, end, list] as [Date, Date, Data[]])),
      ),
      map(([start, end, list]) => {
        return list.filter((v) => new Date(Date.parse(v.before_date)) <= end);
      }),
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
      map((list) => list.reverse()),
    );
  }

  ngOnInit(): void {}

  appSearchCriteriaChanged(event: { startDate: Date; endDate: Date }): void {
    this.dateRange$.next([event.startDate, event.endDate]);
    console.log('start', event.startDate);
    console.log('end', event.endDate);
  }
}
