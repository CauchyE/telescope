import { Component, Input, OnInit } from '@angular/core';
import { Delegation, Validator } from 'cosmos-client/api';

@Component({
  selector: 'view-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  @Input()
  delegations?: Delegation[] | null;

  @Input()
  validators?: Validator[] | null;

  constructor() {}

  ngOnInit(): void {}
}
