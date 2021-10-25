import { Component, OnInit, Input } from '@angular/core';
import {
  CosmosMintV1beta1QueryAnnualProvisionsResponse,
  CosmosMintV1beta1QueryInflationResponse,
} from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  @Input()
  inflation?: CosmosMintV1beta1QueryInflationResponse | null;
  @Input()
  annualProvisions?: CosmosMintV1beta1QueryAnnualProvisionsResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
