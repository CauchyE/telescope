import { Key } from '../../app/models/keys/key.model';
import { KeyService } from '../../app/models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.css'],
})
export class KeysComponent implements OnInit {
  keys$: Observable<Key[]>;
  constructor(private readonly key: KeyService) {
    this.keys$ = from(this.key.list());
  }

  ngOnInit(): void {}
}
