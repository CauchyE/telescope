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
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'view-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Input()
  searchValue: string;

  @Output()
  appSubmitSearchValue: EventEmitter<string>;

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  drawerMode$: Observable<string>;
  drawerOpened$: Observable<boolean>;

  constructor(private router: Router, private mediaObserver: MediaObserver) {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();

    this.drawerMode$ = this.mediaObserver.media$.pipe(
      map((change) => (change.mqAlias === 'xs' ? 'over' : 'side')),
    );

    this.drawerOpened$ = this.mediaObserver.media$.pipe(
      map((change) => (change.mqAlias === 'xs' ? false : true)),
    );

    combineLatest(this.drawerMode$, this.router.events).subscribe(
      ([drawerMode, event]) => {
        if (drawerMode === 'over' && event instanceof NavigationEnd) {
          this.sidenav.close();
        }
      },
    );
  }

  ngOnInit() {}

  onSubmitSearchValue(value: string) {
    this.appSubmitSearchValue.emit(value);
  }
}
