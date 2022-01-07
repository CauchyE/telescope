import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

export type SearchResult = {
  searchValue: string;
  type: string;
};

@Component({
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  searchResult?: SearchResult | null;

  @Output()
  appSubmitSearchResult: EventEmitter<SearchResult>;

  @Output()
  appChangeInputValue: EventEmitter<string>;

  searchValue: string;

  constructor() {
    this.searchValue = '';
    this.searchResult = {
      searchValue: '',
      type: '',
    };
    this.appSubmitSearchResult = new EventEmitter();
    this.appChangeInputValue = new EventEmitter();
  }

  ngOnInit(): void {}

  onOptionSelected(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onSubmitSearchResult(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onChangeInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }

  onFocusInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }
}
