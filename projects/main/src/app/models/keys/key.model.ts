export enum KeyType {
  SECP256K1 = 'secp256k1',
  ED25519 = 'ed25519',
  SR25519 = 'sr25519',
}

export type Key = {
  id: string;
  type: KeyType;
  public_key: string;
};

export type KeyCreateResult = {
  saved: Boolean;
  checked: Boolean;
};
