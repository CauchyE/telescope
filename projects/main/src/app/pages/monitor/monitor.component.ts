import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent implements OnInit {
  dataArray$: Observable<Data[]>;
  startDate$: BehaviorSubject<Date>;
  endDate$: BehaviorSubject<Date>;
  count$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private readonly monitor: MonitorService,
    private snackBar: MatSnackBar,
  ) {
    const now = new Date();
    this.endDate$ = new BehaviorSubject(now);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    this.startDate$ = new BehaviorSubject(yesterday);
    const startDateMinus1$ = this.startDate$.asObservable().pipe(
      map((start) => {
        start.setDate(start.getDate() - 1);
        return start;
      }),
    );
    const endDateMinus1$ = this.endDate$.asObservable().pipe(
      map((end) => {
        end.setDate(end.getDate() - 1);
        return end;
      }),
    );
    this.count$ = combineLatest([startDateMinus1$, endDateMinus1$]).pipe(
      map(([start, end]) =>
        Math.ceil((end.getMilliseconds() - start.getMilliseconds()) / 86400000),
      ),
    );
    this.dataArray$ = combineLatest([startDateMinus1$, endDateMinus1$, this.count$]).pipe(
      mergeMap(([start, end, count]) =>
        this.monitor
          .list(start.getFullYear(), start.getMonth() + 1, start.getDate(), count)
          .pipe(map((list) => [start, end, list] as [Date, Date, Data[]])),
      ),
      map(([start, end, list]) =>
        list.filter(
          (v) => start < new Date(Date.parse(v.date)) && new Date(Date.parse(v.date)) < end,
        ),
      ),
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
      map((list) => list.reverse()),
    );
    this.dataArray$.subscribe((data) => console.log(data));
  }

  ngOnInit(): void {}

  appSearchCriteriaChanged(event: { startDate: Date; endDate: Date }): void {
    this.startDate$.next(event.startDate);
    this.endDate$.next(event.endDate);
    console.log('start', event.startDate);
    console.log('end', event.endDate);
  }
}
