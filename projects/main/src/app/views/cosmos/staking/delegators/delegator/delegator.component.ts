import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20063, InlineResponse20066 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  @Input()
  delegations?: InlineResponse20063 | null;

  @Input()
  validators?: InlineResponse20066 | null;

  constructor() {}

  ngOnInit(): void {}
}
