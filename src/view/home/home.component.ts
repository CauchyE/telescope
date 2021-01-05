import { Component, OnInit, Input } from '@angular/core';
import { PaginatedQueryTxs } from 'cosmos-client/api';

type NodeInfo = {
  application_version: {
    build_tags: string;
    client_name: string;
    commit: string;
    go: string;
    name: string;
    server_name: string;
    version: string;
  };
  node_info: {
    id: string;
    moniker: string;
    protocol_version: {
      p2p: number;
      block: number;
      app: number;
    };
    network: string;
    channels: string;
    listen_addr: string;
    version: string;
    other: {
      tx_index: string;
      rpc_address: string;
    };
  };
};

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input()
  nodeInfo?: NodeInfo | null;

  @Input()
  syncing?: boolean | null;

  @Input()
  txs?: PaginatedQueryTxs | null;

  constructor() {}

  ngOnInit(): void {}
}
