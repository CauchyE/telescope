import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { NgModel } from '@angular/forms';

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
  appSubmitSearchValue: EventEmitter<string>;

  @ViewChild('searchValueRef')
  searchValueRef!: NgModel;

  options = [
    {
      label: (value: string) => `Address "${value}"`,
      format: (value: string) => `address=${value}`,
    },
    {
      label: (value: string) => `Tx hash "${value}"`,
      format: (value: string) => `tx_hash=${value}`,
    },
  ];

  constructor() {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();
  }

  ngOnInit(): void {}

  onOptionSelected(option: any): void {
    this.appSubmitSearchValue.emit(option);
  }

  onSubmit(value: string) {
    this.appSubmitSearchValue.emit(value);
  }
}
