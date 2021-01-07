import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'view-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Input()
  extensionNavigations?: { name: string; link: string }[];

  @Input()
  searchValue: string | null;

  @Output()
  appSubmitSearchValue: EventEmitter<string>;

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  drawerMode$: Observable<MatDrawerMode>;
  drawerOpened$: Observable<boolean>;

  constructor(private router: Router, private mediaObserver: MediaObserver) {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();

    this.drawerMode$ = this.mediaObserver
      .asObservable()
      .pipe(
        map((changes) =>
          changes.find((change) => change.mqAlias === 'xs') ? 'over' : 'side',
        ),
      );

    this.drawerOpened$ = this.mediaObserver
      .asObservable()
      .pipe(
        map((changes) =>
          changes.find((change) => change.mqAlias === 'xs') ? false : true,
        ),
      );

    combineLatest([this.drawerMode$, this.router.events]).subscribe(
      ([drawerMode, event]) => {
        if (drawerMode === 'over' && event instanceof NavigationEnd) {
          this.sidenav?.close();
        }
      },
    );
  }

  ngOnInit() {}

  onSubmitSearchValue(value: string) {
    this.appSubmitSearchValue.emit(value);
  }
}
