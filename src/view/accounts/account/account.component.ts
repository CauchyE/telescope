import { Component, OnInit, Input } from '@angular/core';
import { BaseAccount } from 'cosmos-client/x/auth';

@Component({
  selector: 'view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @Input()
  account?: BaseAccount

  constructor() { }

  ngOnInit(): void {
  }

}
