import { Component, OnInit, Input } from '@angular/core';
import { PaginatedQueryTxs } from 'cosmos-client/api';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input()
  txs?: PaginatedQueryTxs | null;

  constructor() {}

  ngOnInit(): void {}
}
