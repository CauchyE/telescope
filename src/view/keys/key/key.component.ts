import { Component, OnInit, Input } from '@angular/core';
import { Key } from '@model/keys/key.model';

@Component({
  selector: 'view-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  @Input()
  key?: Key | null;

  constructor() {}

  ngOnInit(): void {}
}
