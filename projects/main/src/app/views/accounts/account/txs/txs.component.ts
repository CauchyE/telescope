import { Component, Input, OnInit } from '@angular/core';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input() txsWithPagination?: CosmosTxV1beta1GetTxsEventResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
