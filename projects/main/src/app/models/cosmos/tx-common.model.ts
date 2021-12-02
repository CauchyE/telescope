import { proto } from '@cosmos-client/core';
import { InlineResponse20074 } from '@cosmos-client/core/esm/openapi';

export type SimulatedTxResultResponse = {
  simulatedResultData: InlineResponse20074;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  estimatedGasUsedWithMargin: proto.cosmos.base.v1beta1.ICoin;
  estimatedFeeWithMargin: proto.cosmos.base.v1beta1.ICoin;
};
