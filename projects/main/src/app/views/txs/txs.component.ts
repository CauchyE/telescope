import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CosmosTxV1beta1GetTxsEventResponseTxResponses } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input()
  latestTxs?: CosmosTxV1beta1GetTxsEventResponseTxResponses[] | null;
  @Input()
  txTypeOptions?: string[] | null;
  @Input()
  selectedTxType?: string | null;

  @Input()
  pageSizeOptions?: number[] | null;
  @Input()
  pageSize?: number | null;
  @Input()
  pageNumber?: number | null;
  @Input()
  pageLength?: number | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
  }

  ngOnInit(): void {}

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType);
  }

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }
}
