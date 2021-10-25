import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse } from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  @Input()
  block?: InlineResponse20036 | null;
  @Input()
  validatorsets?: CosmosBaseTendermintV1beta1GetValidatorSetByHeightResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
