export type FaucetRequest = {
  address: string;
  coins: {
    amount: number;
    denom: string;
  }[];
};

export type FaucetResponse = {
  transfers: {
    coin: string;
    status: string;
    message?: string;
  }[];
};
