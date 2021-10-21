import { MonitorService, Data } from '../../models/monitor.service';
import { Component, OnInit } from '@angular/core';
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
  count$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    this.startDate$ = new BehaviorSubject(yesterday);
    this.dataArray$ = combineLatest([
      this.startDate$.asObservable(),
      this.count$.asObservable(),
    ]).pipe(
      map(([startDate, count]) => {
        return [...Array(count).keys()].map((index) => {
          const tempDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() - index,
          );
          return {
            year: tempDate.getFullYear(),
            month: tempDate.getMonth() + 1,
            day: tempDate.getDate(),
          };
        });
      }),
      mergeMap((dateArray) => {
        return forkJoin(
          dateArray.map((date) => this.monitor.list(date.year, date.month, date.day, 1)),
        );
      }),
      map((dataArray) => dataArray.map((elementArray) => elementArray[0])),
      catchError((err) => {
        console.error(err);
        return of([]);
      }),
    );
  }

  ngOnInit(): void {}

  appSearchCriteriaChanged(event: { startDate: Date; count: number }): void {
    this.startDate$.next(event.startDate);
    this.count$.next(event.count);
  }
}
