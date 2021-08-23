import { Component, Input, OnInit } from '@angular/core';
import { websocket } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input()
  initialTxs?: CosmosTxV1beta1GetTxsEventResponseTxResponses[] | undefined | null;
  @Input()
  latestTxs?: websocket.ResponseSchema[] | undefined | null;

  constructor() { }

  ngOnInit(): void { }
}