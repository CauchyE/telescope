import { Component, Input, OnInit } from '@angular/core';
import { websocket } from 'cosmos-client';

@Component({
  selector: 'view-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  @Input()
  latestTxs?: websocket.ResponseSchema[] | null | undefined;

  constructor() { }

  ngOnInit(): void { }
}
