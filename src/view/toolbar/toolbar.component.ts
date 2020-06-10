import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  searchValue: string;
  @Output()
  appSubmitSearchValue: EventEmitter<[string, string]>;

  constructor() {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();
  }

  ngOnInit(): void { }

  searchForTransaction(searchValue: string): void {
    this.appSubmitSearchValue.emit(['txs', searchValue]);
  }

  searchForAccount(searchValue: string): void {
    this.appSubmitSearchValue.emit(['accounts', searchValue]);
  }
}
