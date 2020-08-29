require('dotenv').config();

export default {
  url: process.env.API_URL || '',
  chain_id: process.env.CHAIN_ID || '',
  bech32_prefix: {
    acc_addr: process.env.BECH32_PREFIX_ACC_ADDR,
    acc_pub: process.env.BECH32_PREFIX_ACC_PUB,
    val_addr: process.env.BECH32_PREFIX_VAL_ADDR,
    val_pub: process.env.BECH32_PREFIX_VAL_PUB,
    cons_addr: process.env.BECH32_PREFIX_COMS_ADDR,
    cons_pub: process.env.BECH32_PREFIX_COMS_PUB,
  },
  indexed_db_name: process.env.INDEXED_DB_NAME || 'cosmoscan',
} as const;
