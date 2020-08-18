import { Component, OnInit } from '@angular/core';
import { SendOnSubmitEvent } from '@view/keys/key/send/send.component';
import { KeyApplicationService } from '@model/keys/key.application.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  constructor(private readonly keyApplication: KeyApplicationService) {}

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
