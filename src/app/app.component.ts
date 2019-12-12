import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  forms: {
    search: string;
  };
  drawerMode$: Observable<string>;
  drawerOpened$: Observable<boolean>;

  constructor(private router: Router, mediaObserver: MediaObserver) {
    this.forms = {
      search: ""
    };
    this.drawerMode$ = mediaObserver.media$.pipe(
      map(change => (change.mqAlias === "xs" ? "over" : "side"))
    );

    this.drawerOpened$ = mediaObserver.media$.pipe(
      map(change => (change.mqAlias === "xs" ? false : true))
    );
  }

  async submit() {
    await this.router.navigate([""], { queryParams: { q: this.forms.search } });
  }
}
