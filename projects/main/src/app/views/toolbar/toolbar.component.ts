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
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  searchValue: string | null;

  @Output()
  appSubmitSearchValue: EventEmitter<string>;

  @ViewChild('searchValueRef')
  searchValueRef!: NgModel;

  options = [
    {
      label: (value: string) => {
        const equalCharacter = value.indexOf("=")
        if (equalCharacter) {
          const fixedValue = value.substr(equalCharacter + 1)
          return `Address "${fixedValue}"`
        }
        else {
          return `Address "${value}"`
        }
      },
      format: (value: string) => {
        const equalCharacter = value.indexOf("=")
        if (equalCharacter) {
          const fixedValue = value.substr(equalCharacter + 1)
          return `address=${fixedValue}`
        }
        else {
          return `address=${value}`
        }
      }
    },
    {
      label: (value: string) => {
        const equalCharacter = value.indexOf("=")
        if (equalCharacter) {
          const fixedValue = value.substr(equalCharacter + 1)
          return `Tx hash "${fixedValue}"`
        }
        else {
          return `Tx hash "${value}"`
        }
      },
      format: (value: string) => {
        const equalCharacter = value.indexOf("=")
        if (equalCharacter) {
          const fixedValue = value.substr(equalCharacter + 1)
          return `tx_hash=${fixedValue}`
        }
        else {
          return `tx_hash=${value}`
        }
      },
    },
  ];

  constructor() {
    this.searchValue = '';
    this.appSubmitSearchValue = new EventEmitter();
  }

  ngOnInit(): void { }

  onOptionSelected(option: any): void {
    this.appSubmitSearchValue.emit(option);
  }

  onSubmit(value: string) {
    this.appSubmitSearchValue.emit(value);
  }
}
