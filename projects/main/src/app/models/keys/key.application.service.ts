import { KeyType } from './key.model';
import { KeyService } from './key.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class KeyApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly loadingDialog: LoadingDialogService,
    private readonly key: KeyService,
  ) {
    console.log('KeyApplicationService', router, snackBar, loadingDialog, key);
  }

  async create(id: string, type: KeyType, privateKey: string) {
    const key = await this.key.get(id);
    if (key !== undefined) {
      this.snackBar.open('ID is already used', undefined, {
        duration: 6000,
      });
      return;
    }

    const publicKey = Buffer.from(await this.key.getPrivKey(type, privateKey).pubKey().bytes()).toString('hex');
    const keyList = await this.key.list()
    for (var i = 0; i < keyList.length; i++) {
      if (keyList[i].public_key === publicKey) {
        this.snackBar.open('This mnemonic is already used', undefined, {
          duration: 3000,
        });
        return;
      }
    }

    const dialogRef = this.loadingDialog.open('Creating');
    try {
      await this.key.set(id, type, privateKey);
    } catch {
      this.snackBar.open('Error has occured', undefined, {
        duration: 6000,
      });
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully created', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['keys', id]);
  }

  async delete(id: string) {
    await this.key.delete(id);

    this.snackBar.open('Successfully deleted', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['keys']);
  }

  sign(data: string, privateKey: string): string {
    const uInt8ArrayData = Uint8Array.from(Buffer.from(data, 'base64'));
    const uInt8ArraySignedData = this.key.sign(KeyType.SECP256K1, privateKey, uInt8ArrayData);
    const base64SignedData = Buffer.from(uInt8ArraySignedData).toString('base64');
    return base64SignedData;
  }
}
