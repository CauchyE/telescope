import { Component, Input, OnInit } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20043,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from 'cosmos-client/cjs/openapi/api';

@Component({
  selector: 'view-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  @Input()
  commision?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  rewards?: InlineResponse20043 | null;
  @Input()
  description?: CosmosDistributionV1beta1QueryValidatorSlashesResponse | null;

  constructor() { }

  ngOnInit(): void { }
}
