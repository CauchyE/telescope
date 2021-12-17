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

  @Input()
  searchWordOption: {label:string,allowed:boolean} | null;

  @Output()
  appSubmitSearchValue: EventEmitter<string>;

  @Output()
  appSubmitInputValue: EventEmitter<string>;

  @ViewChild('searchValueRef')
  searchValueRef!: NgModel;


  options = [
    {
      //address
      label: (value: string) => `Address "${value}"`,
      format: (value: string) => `address=${value}`,
      allowed: (value: string) => true,
    },
    {
      //transaction
      label: (value: string) => `Tx hash "${value}"`,
      format: (value: string) => `tx_hash=${value}`,
      allowed: (value: string) => false,
    },
    {
      //blocks
      label: (value: string) => `Blocks "${value}"`,
      format: (value: string) => `Blocks=${value}`,
      allowed: (value: string) => true,
    },
  ];

  constructor() {
    this.searchValue = '';
    this.searchWordOption = {label:"",allowed:false}
    this.appSubmitSearchValue = new EventEmitter();
    this.appSubmitInputValue = new EventEmitter();
  }

  ngOnInit(): void { }



  onOptionSelected(option: any): void {
    this.appSubmitSearchValue.emit(option);
  }

  onSubmit(value: string): void {
    this.appSubmitSearchValue.emit(value);
  }

  onChangeInput(inputValue: string): void {
    this.appSubmitInputValue.emit(inputValue);
  }
}
