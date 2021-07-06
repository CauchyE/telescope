import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { KeySelectDialogService } from './key-select-dialog.service';
import { KeyStoreService } from './key.store.service';

@Injectable({
  providedIn: 'root',
})
export class KeySelectGuard implements CanActivate {
  constructor(private readonly keyStore: KeyStoreService, private readonly keySelectDialog: KeySelectDialogService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.keyStore.currentKey$
      .pipe(first())
      .toPromise()
      .then(async (currentKey) => {
        while (!currentKey) {
          currentKey = await this.keySelectDialog.open();
        }

        return true;
      });
  }
}
