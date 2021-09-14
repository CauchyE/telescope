import { Key } from '../../../models/keys/key.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as crypto from 'crypto';

@Component({
  selector: 'app-key-select-dialog',
  templateUrl: './key-select-dialog.component.html',
  styleUrls: ['./key-select-dialog.component.css'],
})
export class KeySelectDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      keys: Key[];
      currentKeyID: string | undefined;
    },
    private readonly dialogRef: MatDialogRef<KeySelectDialogComponent>,
  ) {}

  ngOnInit(): void {}

  getColorCode(key: Key) {
    const hash = crypto.createHash('sha256').update(Buffer.from(key.id)).digest().toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  onClickKey(key: Key) {
    this.dialogRef.close(key);
  }
}
