import { Key } from '../../../app/models/keys/key.model';
import { KeyService } from '../../../app/models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient } from 'cosmos-client';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;
  accAddress$: Observable<cosmosclient.AccAddress | undefined>;
  valAddress$: Observable<cosmosclient.ValAddress | undefined>;

  constructor(private readonly route: ActivatedRoute, private readonly key: KeyService) {
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
    const pubKey$ = this.key$.pipe(
      filter((key) => !!key),
      map((key) => this.key.getPubKey(key!.type, key!.public_key)),
    );

    this.accAddress$ = pubKey$.pipe(map((key) => cosmosclient.AccAddress.fromPublicKey(key)));
    this.valAddress$ = pubKey$.pipe(map((key) => cosmosclient.ValAddress.fromPublicKey(key)));
  }

  ngOnInit(): void {}
}
