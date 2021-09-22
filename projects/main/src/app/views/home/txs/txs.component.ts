import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input()
  txTypeOptions?: string[] | undefined | null;
  @Input()
  selectedTxType?: string | undefined | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void { }

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType)
  }
}
