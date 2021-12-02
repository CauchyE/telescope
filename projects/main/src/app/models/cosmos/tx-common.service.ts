import { CosmosSDKService } from '../cosmos-sdk.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class TxCommonService {
  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  async simulateTx(
    txBuilder: cosmosclient.TxBuilder,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<SimulatedTxResultResponse> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);

    // restore json from txBuilder
    const txForSimulation = JSON.parse(txBuilder.cosmosJSONStringify());

    // fix JSONstringify issue
    delete txForSimulation.auth_info.signer_infos[0].mode_info.multi;

    // simulate
    const simulatedResult = await rest.tx.simulate(sdk, {
      tx: txForSimulation,
      tx_bytes: txBuilder.txBytes(),
    });
    console.log('simulatedResult', simulatedResult);

    // estimate fee
    const simulatedGasUsed = simulatedResult.data.gas_info?.gas_used;
    // This margin prevents insufficient fee due to data size difference between simulated tx and actual tx.
    const simulatedGasUsedWithMarginNumber = simulatedGasUsed
      ? parseInt(simulatedGasUsed) * 1.1
      : 200000;
    const simulatedGasUsedWithMargin = simulatedGasUsedWithMarginNumber.toFixed(0);
    // minimumGasPrice depends on Node's config(`~/.jpyx/config/app.toml` minimum-gas-prices).
    const simulatedFeeWithMarginNumber =
      parseInt(simulatedGasUsedWithMargin) *
      parseFloat(minimumGasPrice.amount ? minimumGasPrice.amount : '0');
    const simulatedFeeWithMargin = Math.ceil(simulatedFeeWithMarginNumber).toFixed(0);
    console.log({
      simulatedGasUsed,
      simulatedGasUsedWithMargin,
      simulatedFeeWithMarginNumber,
      simulatedFeeWithMargin,
    });

    return {
      simulatedResultData: simulatedResult.data,
      minimumGasPrice,
      estimatedGasUsedWithMargin: {
        denom: minimumGasPrice.denom,
        amount: simulatedGasUsedWithMargin,
      },
      estimatedFeeWithMargin: {
        denom: minimumGasPrice.denom,
        amount: simulatedFeeWithMargin,
      },
    };
  }

  async announceTx(txBuilder: cosmosclient.TxBuilder): Promise<InlineResponse20075> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);

    // broadcast tx
    const result = await rest.tx.broadcastTx(sdk, {
      tx_bytes: txBuilder.txBytes(),
      mode: rest.tx.BroadcastTxMode.Block,
    });

    // check broadcast tx error
    if (result.data.tx_response?.code !== 0) {
      throw Error(result.data.tx_response?.raw_log);
    }

    return result.data;
  }
}
