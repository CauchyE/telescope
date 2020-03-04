import { Component, ViewChild } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { StateService } from './core/services/state.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  drawerMode$: Observable<string>;
  drawerOpened$: Observable<boolean>;
  designated$: Observable<boolean>;

  constructor(
    private router: Router,
    private mediaObserver: MediaObserver,
    private state: StateService
  ) {
    this.drawerMode$ = this.mediaObserver.media$.pipe(
      map(change => (change.mqAlias === 'xs' ? 'over' : 'side'))
    );

    this.drawerOpened$ = this.mediaObserver.media$.pipe(
      map(change => (change.mqAlias === 'xs' ? false : true))
    );

    this.designated$ = this.state.value$.pipe(
      map(state => state.designatedHost !== undefined)
    );

    combineLatest(this.drawerMode$, this.router.events).subscribe(
      ([drawerMode, event]) => {
        if (drawerMode === 'over' && event instanceof NavigationEnd) {
          this.sidenav.close();
        }
      },
    );
  }
}
