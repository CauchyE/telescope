import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Key } from '@model/keys/key.model';
import { ActivatedRoute } from '@angular/router';
import { KeyService } from '@model/index';
import { map, mergeMap } from 'rxjs/operators';
import { AccAddress, ValAddress } from 'cosmos-client';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;
  accAddress$: Observable<AccAddress | undefined>;
  valAddress$: Observable<ValAddress | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly key: KeyService,
  ) {
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
  }

  ngOnInit(): void {}
}
