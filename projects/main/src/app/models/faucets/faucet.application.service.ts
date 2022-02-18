import { FaucetRequest } from './faucet.model';
import { FaucetService } from './faucet.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class FaucetApplicationService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly faucetService: FaucetService,
  ) {}

  async postFaucetRequest(faucetRequest: FaucetRequest) {
    const dialogRef = this.loadingDialog.open('Claiming...');

    this.faucetService
      .postFaucetRequest(faucetRequest)
      .then((faucetResponse) => {
        console.log(faucetResponse);

        if (faucetResponse.transfers.length > 0) {
          const resultList = faucetResponse.transfers.map((transfer) => {
            if (transfer.status === 'ok') {
              return true;
            } else if (transfer.message?.includes('Error: RPC error -32603')) {
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
      })
      .catch((error) => {
        console.error(error);
        this.snackBar.open('Failed', undefined, { duration: 6000 });
      })
      .finally(() => {
        dialogRef.close();
      });
  }
}
