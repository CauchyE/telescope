import { Component, OnInit } from '@angular/core';
import { StateService } from '../core/services/state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  designated$: Observable<boolean>;

  constructor(private state: StateService) {
    this.designated$ = this.state.value$.pipe(
      map(state => state.designatedHost !== undefined)
    );
  }

  ngOnInit() { }
}
