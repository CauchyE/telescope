import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  // tslint:disable-next-line
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  searchValue: string;
  @Output()
  appSubmitSearchValue: EventEmitter<[string, string]>;

  options = [
    { value: 'txs', label: 'Search for transaction' },
    { value: 'accounts', label: 'Search for accounts' },
  ];

  searchBox: FormControl;

  constructor() {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();
    this.searchBox = new FormControl();
  }

  ngOnInit(): void {}

  onOptionSelected(option: any): void {
    const paths = (this?.searchValue ?? '').split('/');
    const value = paths[paths.length - 1];
    this.searchBox.setValue(`${option.value}/${value}`);
    this.appSubmitSearchValue.emit([option.value, value]);
  }
}
