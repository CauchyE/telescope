import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'view-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input()
  txHash: string;
  @Output()
  appSubmitTxHash: EventEmitter<string>

  constructor() {
    this.txHash = ""
    this.appSubmitTxHash = new EventEmitter()
  }

  ngOnInit(): void {}

  onSubmit(txHash: string) {
    this.appSubmitTxHash.emit(txHash)
  }
}
