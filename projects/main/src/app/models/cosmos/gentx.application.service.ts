import { Key } from '../keys/key.model';
import { GentxService } from './gentx.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class GentxApplicationService {
  constructor(
    private readonly gentxService: GentxService,
    private readonly loadingDialog: LoadingDialogService,
    private readonly snackBar: MatSnackBar,
  ) {}

  // Todo: gentx should be refactor with GentxData interface or type.
  async gentx(
    key: Key | undefined,
    privateKey: string,
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    max_rate: string,
    max_change_rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
  ): Promise<{ [k: string]: any } | undefined> {
    if (key === undefined) {
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      this.snackBar.open('Invalid key', undefined, { duration: 6000 });
      return undefined;
    }

    const dialogRef = this.loadingDialog.open('Generating');

    let gentxResult: { [k: string]: any } | undefined;

    try {
      gentxResult = await this.gentxService.gentx(
        key,
        privateKey,
        moniker,
        identity,
        website,
        security_contact,
        details,
        rate,
        max_rate,
        max_change_rate,
        min_self_delegation,
        delegator_address,
        validator_address,
        denom,
        amount,
      );
    } catch (error) {
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      return undefined;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully generated', undefined, { duration: 6000 });

    return gentxResult;
  }
}
