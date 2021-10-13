import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FaucetInfrastructureService } from './faucet.infrastructure.service';
import { FaucetRequest, FaucetResponse } from './faucet.model';

export interface InterfaceFaucetInfrastructureService {
  postFaucetRequest$: (faucetRequest: FaucetRequest) => void;
}

@Injectable({
  providedIn: 'root',
})
export class FaucetService {
  constructor(private faucetInfrastructureService: FaucetInfrastructureService) {}

  postFaucetRequest$(faucetRequest: FaucetRequest): Observable<FaucetResponse> {
    return this.faucetInfrastructureService.postFaucetRequest$(faucetRequest);
  }
}
