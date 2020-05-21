import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _value: State;
  private _value$: BehaviorSubject<State>;

  constructor() {
    this._value = {};
    this._value$ = new BehaviorSubject(this._value);
  }

  public get value$() {
    return this._value$.asObservable();
  }

  public update(data: Partial<State>) {
    this._value = {
      ...this._value,
      ...data
    };
    this._value$.next(this._value);
  }
}

export interface State {
  designatedHost?: {
    url: string;
    chainID: string;
  };
}
