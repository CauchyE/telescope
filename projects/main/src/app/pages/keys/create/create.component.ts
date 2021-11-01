import { KeyService } from '../../../models/keys/key.service';
import { CreateOnSubmitEvent } from '../../../views/keys/create/create.component';
import { Component, OnInit } from '@angular/core';
import * as bip39 from 'bip39';
import { KeyApplicationService } from 'projects/main/src/app/models/keys/key.application.service';
import { KeyBackupDialogService } from '../../../models/keys/key-backup-dialog.service';
import { KeyCreateResult } from '../../../models/keys/key.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  mnemonic: string;
  privateKey: string;
  createResult: KeyCreateResult | undefined

  constructor(
    private readonly keyApplication: KeyApplicationService,
    private readonly key: KeyService,
    private readonly keyBackupDialog: KeyBackupDialogService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.mnemonic = '';
    this.privateKey = '';
  }

  ngOnInit(): void { }

  onClickCreateMnemonic() {
    this.mnemonic = bip39.generateMnemonic();
    window.alert('You must memory this mnemonic.');
  }

  async onBlurMnemonic(mnemonic: string) {
    if (!mnemonic) {
      return;
    }
    this.privateKey = await this.key.getPrivateKeyFromMnemonic(mnemonic);
  }

  async onSubmit($event: CreateOnSubmitEvent) {

    this.createResult = await this.keyBackupDialog.open(this.mnemonic, $event.privateKey, $event.id);
    //const createResult: KeyCreateResult | undefined = await this.keyBackupDialog.open(this.mnemonic, $event.privateKey, $event.id);

    if (this.createResult?.checked === true) {
      await this.keyApplication.create($event.id, $event.type, $event.privateKey);
    } else {
      this.snackBar.open('create failed', undefined, {
        duration: 3000,
      });
    }
  }
}
