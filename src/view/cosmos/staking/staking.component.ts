import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse2006 } from 'cosmos-client/api';

@Component({
  selector: 'view-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  @Input()
  params?: InlineResponse2006 | null;

  constructor() {}

  ngOnInit(): void {}
}
