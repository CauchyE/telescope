import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyApplicationService } from 'projects/cosmoscan/src/model/keys/key.application.service';
import { SignOnSignEvent } from 'projects/cosmoscan/src/view/keys/sign/sign.component';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  data$: Observable<string>;
  signature: string;

  constructor(private readonly route: ActivatedRoute, private readonly keyApplication: KeyApplicationService) {
    this.data$ = this.route.params.pipe(map((params) => params['data'] || ''));
    this.signature = '';
  }

  ngOnInit(): void {
  }

  async onSign(data: SignOnSignEvent) {
    this.keyApplication.sign(data.data, data.privateKey);
  }
}
