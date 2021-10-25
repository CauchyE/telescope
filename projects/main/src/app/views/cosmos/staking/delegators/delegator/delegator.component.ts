import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20059, InlineResponse20062 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  @Input()
  delegations?: InlineResponse20059 | null;

  @Input()
  validators?: InlineResponse20062 | null;

  constructor() {}

  ngOnInit(): void {}
}
