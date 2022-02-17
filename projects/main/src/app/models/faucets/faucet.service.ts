import { FaucetInfrastructureService } from './faucet.infrastructure.service';
import { FaucetRequest, FaucetResponse } from './faucet.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface InterfaceFaucetInfrastructureService {
  postFaucetRequest: (faucetRequest: FaucetRequest) => void;
}

@Injectable({
  providedIn: 'root',
})
export class FaucetService {
  constructor(private faucetInfrastructureService: FaucetInfrastructureService) {}

  postFaucetRequest(faucetRequest: FaucetRequest): Promise<FaucetResponse> {
    return this.faucetInfrastructureService.postFaucetRequest(faucetRequest);
  }
}
