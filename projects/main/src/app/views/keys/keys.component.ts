import { Key } from '../../models/keys/key.model';
import { Component, OnInit, Input } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'view-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.css'],
})
export class KeysComponent implements OnInit {
  @Input()
  keys?: Key[] | null;

  constructor() {}

  ngOnInit(): void {}

  getColorCode(key: Key) {
    const hash = crypto.createHash('sha256').update(Buffer.from(key.id)).digest().toString('hex');

    return `#${hash.substr(0, 6)}`;
  }
}
