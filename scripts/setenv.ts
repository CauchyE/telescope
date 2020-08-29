const { writeFile } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();

const environment = process.env.ENV;
const isProduction = environment === 'production';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const environmentFileContent = `
export const environment = {
  production: ${isProduction},
  env: '${process.env.ENV}',
  url: '${process.env.API_URL || ''}',
  chain_id: '${process.env.CHAIN_ID || ''}',
  bech32_prefix: {
    acc_addr: '${process.env.BECH32_PREFIX_ACC_ADDR}',
    acc_pub: '${process.env.BECH32_PREFIX_ACC_PUB}',
    val_addr: '${process.env.BECH32_PREFIX_VAL_ADDR}',
    val_pub: '${process.env.BECH32_PREFIX_VAL_PUB}',
    cons_addr: '${process.env.BECH32_PREFIX_COMS_ADDR}',
    cons_pub: '${process.env.BECH32_PREFIX_COMS_PUB}',
  },
  indexed_db_name: '${process.env.INDEXED_DB_NAME || 'cosmoscan'}',
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
