import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingDialogService } from 'ng-loading-dialog';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { FaucetRequest } from 'projects/main/src/app/models/faucets/faucet.model';
import { FaucetService } from 'projects/main/src/app/models/faucets/faucet.service';
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
    private router: Router,
    private configS: ConfigService,
    private faucetService: FaucetService,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
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
    const dialogRef = this.loadingDialog.open('Claiming...');
    const subscription = this.faucetService.postFaucetRequest$(faucetRequest).subscribe(
      (faucetResponse) => {
        console.log(faucetResponse);
        dialogRef.close();
        subscription.unsubscribe();
        if (faucetResponse.transfers.length > 0) {
          const resultList = faucetResponse.transfers.map((transfer) => {
            if (transfer.status === 'ok') {
              return true;
            } else {
              return false;
            }
          });
          const result = resultList.every((element) => element === true);
          if (result) {
            this.snackBar.open('Success', undefined, { duration: 3000 });
            this.router.navigate(['/accounts', faucetRequest.address]);
          } else {
            this.snackBar.open('Failed', undefined, { duration: 6000 });
          }
        } else {
          this.snackBar.open('Failed', undefined, { duration: 6000 });
        }
      },
      (error) => {
        console.error(error);
        dialogRef.close();
        subscription.unsubscribe();
        this.snackBar.open('Failed', undefined, { duration: 6000 });
      },
    );
  }

  appSelectedDenomChange(selectedDenom: string): void {
    this.denom$?.next(selectedDenom);
  }
}
