import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Key } from '@model/keys/key.model';
import { CosmosSDKService, KeyService } from '@model/index';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.css'],
})
export class KeysComponent implements OnInit {
  keys$: Observable<Key[]>;
  constructor(private readonly key: KeyService) {
    this.keys$ = from(this.key.keys());
  }

  ngOnInit(): void {}
}
