import { Component, Input, OnInit } from '@angular/core';
import { CosmosDistributionV1beta1QueryCommunityPoolResponse } from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  @Input()
  communityPool?: CosmosDistributionV1beta1QueryCommunityPoolResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
