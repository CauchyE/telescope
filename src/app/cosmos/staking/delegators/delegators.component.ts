import { Component, OnInit } from '@angular/core';
import { staking } from 'cosmos-client/x/staking';
import { from } from 'rxjs';

@Component({
  selector: 'app-delegators',
  templateUrl: './delegators.component.html',
  styleUrls: ['./delegators.component.css'],
})
export class DelegatorsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
