import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { StateService } from "./core/services/state.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  drawerMode$: Observable<string>;
  drawerOpened$: Observable<boolean>;
  designated$: Observable<boolean>;

  constructor(
    private router: Router,
    private mediaObserver: MediaObserver,
    private state: StateService
  ) {
    this.drawerMode$ = this.mediaObserver.media$.pipe(
      map(change => (change.mqAlias === "xs" ? "over" : "side"))
    );

    this.drawerOpened$ = this.mediaObserver.media$.pipe(
      map(change => (change.mqAlias === "xs" ? false : true))
    );

    this.designated$ = this.state.value$.pipe(
      map(value => !!value.designatedHost)
    );
  }
}
