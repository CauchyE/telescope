export type Key = {
  id: string;
  type: 'secp256k1' | 'ed25519' | 'sr25519';
  public_key: string;
};
