import { Component, Input, OnInit } from '@angular/core';
import { websocket } from 'cosmos-client';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi';
import { config } from 'process';
import { Config, ConfigService } from './../../../models/config.service';

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
  //@Input()
  //config?: Config

  constructor(
    private readonly config: ConfigService
  ) { }

  ngOnInit(): void { }

  tx_group = this.config.config.extension?.messageModules
  selected_tx_group = this.tx_group?.[0]
}
