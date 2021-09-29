import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { KeySelectDialogService } from './key-select-dialog.service';
import { KeyService } from './key.service';
import { KeyStoreService } from './key.store.service';

@Injectable({
  providedIn: 'root',
})
export class KeySelectGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly keySelectDialog: KeySelectDialogService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const keys = await this.key.list();
    if (keys.length === 0) {
      window.alert('There is no key. Please create.');
      this.router.navigate(['keys', 'create']);
      return true;
    }
    return this.keyStore.currentKey$
      .pipe(first())
      .toPromise()
      .then(async (currentKey) => {
        currentKey = await this.keySelectDialog.open();

        let count = 0
        while (!currentKey) {
          if (count > 0) {
            return false;
          }
          currentKey = await this.keySelectDialog.open();
          count++
        }

        return true;
      });
  }
}
