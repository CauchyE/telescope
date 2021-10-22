import { Key } from '../keys/key.model';
import { GentxData } from './gentx.model';
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

  async gentx(
    key: Key | undefined,
    gentxData: GentxData,
  ): Promise<{ [k: string]: any } | undefined> {
    if (key === undefined) {
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      this.snackBar.open('Invalid key', undefined, { duration: 6000 });
      return undefined;
    }

    const dialogRef = this.loadingDialog.open('Generating');

    let gentxResult: { [k: string]: any } | undefined;

    try {
      gentxResult = await this.gentxService.gentx(key, gentxData);
    } catch (error) {
      console.error(error);
      this.snackBar.open('Error has occur', undefined, { duration: 6000 });
      return undefined;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully generated', undefined, { duration: 6000 });

    return gentxResult;
  }
}
