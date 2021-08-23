import { Component, Input, OnInit } from '@angular/core';
import { CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse } from 'cosmos-client/cjs/openapi/api';
import { InlineResponse20032 } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {
  @Input()
  block?: InlineResponse20032 | null;
  @Input()
  validatorsets?: CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse | null;

  constructor() { }

  ngOnInit(): void {
  }

}
