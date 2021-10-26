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
  endDate$: BehaviorSubject<Date>;
  count$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(private route: ActivatedRoute, private readonly monitor: MonitorService) {
    const now = new Date();
    this.endDate$ = new BehaviorSubject(now);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    console.log(yesterday);
    this.startDate$ = new BehaviorSubject(yesterday);
    this.dataArray$ = combineLatest([
      this.startDate$.asObservable(),
      this.count$.asObservable(),
    ]).pipe(
      mergeMap(([start, count]) =>
        this.monitor.list(start.getFullYear(), start.getMonth() + 1, start.getDate(), count),
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
    const nextCount = event.endDate.getDate() - event.startDate.getDate();
    this.startDate$.next(event.startDate);
    this.endDate$.next(event.endDate);
    !nextCount ? this.count$.next(1) : this.count$.next(nextCount);
  }
}
