import { FaucetRequest, FaucetResponse } from './faucet.model';
import { InterfaceFaucetInfrastructureService } from './faucet.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from 'projects/main/src/app/models/config.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FaucetInfrastructureService implements InterfaceFaucetInfrastructureService {
  constructor(private configS: ConfigService, private http: HttpClient) {}

  postFaucetRequest$(faucetRequest: FaucetRequest): Observable<FaucetResponse> {
    const requestBody = {
      address: faucetRequest.address,
      coins: faucetRequest.coins.map((coin) => coin.amount + coin.denom),
    };
    const faucetURL = this.getFaucetURL(faucetRequest.coins[0].denom);
    if (faucetURL !== undefined) {
      return this.http
        .post<FaucetResponse>(faucetURL, requestBody)
        .pipe(map((response) => response));
    } else {
      return of({
        address: faucetRequest.address,
        transfers: [],
      });
    }
  }

  getFaucetURL(denom: string): string | undefined {
    const faucetURL = this.configS.config.extension?.faucet?.find(
      (faucet) => faucet.denom === denom,
    )?.faucetURL;
    return faucetURL;
  }
}
