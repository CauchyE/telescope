import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaucetGuard implements CanActivate {
  denom?: string;

  constructor(private configS: ConfigService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.denom = route.queryParams.denom ? route.queryParams.denom : undefined;

    if (this.denom === undefined) {
      return this.configS.config.extension?.faucet !== undefined;
    } else {
      const faucets = this.configS.config.extension?.faucet;
      if (faucets === undefined || faucets.length === undefined) {
        return false;
      } else {
        if (faucets.length === 0) {
          return false;
        } else {
          const matchedFaucet = faucets.find(
            (faucet) => this.denom === faucet.denom && faucet.hasFaucet,
          );
          if (matchedFaucet) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
}
