import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Key } from '@model/keys/key.model';
import { ActivatedRoute } from '@angular/router';
import { KeyService } from '@model/keys/key.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly key: KeyService,
  ) {
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
  }

  ngOnInit(): void {}
}
