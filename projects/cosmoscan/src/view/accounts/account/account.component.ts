import { Component, OnInit, Input } from '@angular/core';
import { BaseAccount } from 'cosmos-client/x/auth';
import { PaginatedQueryTxs } from 'cosmos-client/api';

@Component({
  selector: 'view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  @Input()
  account?: BaseAccount | null;

  @Input()
  paginatedTxs?: any; // PaginatedQueryTxs | null;

  txColumnKeys = ['height', 'txhash', 'timestamp', 'gas_wanted', 'gas_used'];

  constructor() {}

  ngOnInit(): void {}
}
