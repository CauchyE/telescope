import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { InlineResponse20075TxResponse } from '@cosmos-client/core/esm/openapi';
import { PaginationInfo } from '../../pages/txs/txs.component';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input()
  txs?: InlineResponse20075TxResponse[] | null;
  @Input()
  txTypeOptions?: string[] | null;
  @Input()
  selectedTxType?: string | null;

  @Input()
  pageSizeOptions?: number[] | null;

  @Input()
  pageInfo?: PaginationInfo | null;

  @Input()
  pageLength?: number | null;

  @Output()
  selectedTxTypeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  paginationChange: EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter();
  }

  ngOnInit(): void { }

  onSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxTypeChanged.emit(selectedTxType);
  }

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }
}
