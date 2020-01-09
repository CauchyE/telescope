import { TxResponse } from 'cosmos-client-ts';

export const MockTx: TxResponse = {
    height: 11,
    txhash: 'aaa',
    code: 1,
    data: 'iii',
    raw_log: 'uuu',
    logs: [],
    info: 'eee',
    gas_wanted: 2,
    gas_used: 2,
    events: { type: '', attributes: [] },
    codespace: 'ooooo',
    tx: '',
    timestamp: 'nnnnn',
}