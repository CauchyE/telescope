import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyApplicationService } from 'projects/main/src/app/models/keys/key.application.service';
import { SignOnSignEvent } from 'projects/main/src/app/views/keys/sign/sign.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
})
export class SignComponent implements OnInit {
  data$: Observable<string>;
  signature: string;

  constructor(
    private route: ActivatedRoute,
    private readonly keyApplication: KeyApplicationService,
  ) {
    this.data$ = this.route.queryParams.pipe(map((queryParams) => queryParams.data || ''));
    this.signature = '';
  }

  ngOnInit(): void {
    this.data$.subscribe();
  }

  onSign(data: SignOnSignEvent) {
    this.signature = this.keyApplication.sign(data.data, data.privateKey);
  }
}
