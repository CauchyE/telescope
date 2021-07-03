const config = {
  restURL: `${location.protocol}//${location.hostname}:1317`,
  websocketURL: `${location.protocol.replace('http', 'ws')}://${location.hostname}:26657`,
  chainID: "cosmoshub-3",
  bech32Prefix: {
    accAddr: "",
    accPub: "",
    valAddr: "",
    valPub: "",
    consAddr: "",
    consPub: ""
  },
  extension: {
    navigations: [],
    messageActions: []
  }
};
