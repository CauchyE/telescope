import { Component, Input, OnInit } from '@angular/core';
import { QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
})
export class BankComponent implements OnInit {
  @Input()
  totalSupply?: QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod | null;

  constructor() {}

  ngOnInit(): void {}
}
