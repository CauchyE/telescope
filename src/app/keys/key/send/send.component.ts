import { Component, OnInit } from '@angular/core';
import { SendOnSubmitEvent } from '@view/keys/key/send/send.component';
import { Observable } from 'rxjs';
import { Key } from '@model/keys/key.model';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { KeyService, KeyApplicationService } from '@model/index';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly key: KeyService,
    private readonly keyApplication: KeyApplicationService,
  ) {
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
  }

  ngOnInit(): void {}

  async onSubmit($event: SendOnSubmitEvent) {
    await this.keyApplication.send(
      $event.key,
      $event.toAddress,
      $event.amount,
      $event.privateKey,
    );
  }
}
