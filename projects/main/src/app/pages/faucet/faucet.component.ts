import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { FaucetRequest } from 'projects/main/src/app/models/faucets/faucet.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  denoms?: string[];
  address$: Observable<string>;
  denom$?: BehaviorSubject<string>;
  amount$: Observable<number>;
  creditAmount$?: Observable<number>;
  maxCredit$?: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
    private configS: ConfigService,
    private faucetApplication: FaucetApplicationService,
  ) {
    this.denoms = this.configS.config.extension?.faucet?.map((faucet) => faucet.denom);
    this.address$ = this.route.queryParams.pipe(map((queryParams) => queryParams.address));
    this.amount$ = this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
    this.route.queryParams.subscribe((queryParams) => {
      this.denom$ = new BehaviorSubject(queryParams.denom);
      this.creditAmount$ = this.denom$.pipe(
        map((denom) => {
          const faucet = this.configS.config.extension?.faucet
            ? this.configS.config.extension.faucet.find((faucet) => faucet.denom === denom)
            : undefined;
          const creditAmount = faucet ? faucet.creditAmount : 0;
          return creditAmount;
        }),
      );
      this.maxCredit$ = this.denom$.pipe(
        map((denom) => {
          const faucet = this.configS.config.extension?.faucet
            ? this.configS.config.extension.faucet.find((faucet) => faucet.denom === denom)
            : undefined;
          const maxCredit = faucet ? faucet.maxCredit : 0;
          return maxCredit;
        }),
      );
    });
  }

  ngOnInit(): void {}

  appPostFaucetRequested(faucetRequest: FaucetRequest): void {
    this.faucetApplication.postFaucetRequest(faucetRequest);
  }

  appSelectedDenomChange(selectedDenom: string): void {
    this.denom$?.next(selectedDenom);
  }
}
