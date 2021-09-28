import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css']
})
export class TxsComponent implements OnInit {
  @Input()
  latestTxs?: CosmosTxV1beta1GetTxsEventResponseTxResponses[] | null;
  @Input()
  txTypeOptions?: string[] | null;
  @Input()
  selectedTxType?: string | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void { }

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType);
  }
}
