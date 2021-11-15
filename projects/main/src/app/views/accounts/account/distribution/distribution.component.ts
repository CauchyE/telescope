import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  InlineResponse20047,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  @Input()
  commission?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  rewards?: InlineResponse20047 | null;
  @Input()
  slashes?: CosmosDistributionV1beta1QueryValidatorSlashesResponse | null;
  @Input()
  displaySizeOptions?: number[] | null;
  @Input()
  displaySize?: number | null;
  @Input()
  displayNumber?: number | null;
  @Input()
  displayLength?: number | null;
  @Output()
  paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
  }

  ngOnInit(): void { }

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }
}
