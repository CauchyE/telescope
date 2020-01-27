import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { StateService } from '../services/state.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DesignationGuard implements CanActivate {
  constructor(private state: StateService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.state.value$.pipe(
      map(state => state.designatedHost !== undefined)
    );
  }
}
