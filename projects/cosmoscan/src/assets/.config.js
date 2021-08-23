const config = {
  restURL: `http://a.test.jpyx.lcnem.net:1317`,
  websocketURL: `ws://a.test.jpyx.lcnem.net:26657`,
  chainID: 'jpyx-1-test',
  bech32Prefix: {
    accAddr: 'jpyx',
    accPub: 'jpyxpub',
    valAddr: 'jpyxvaloper',
    valPub: 'jpyxvaloperpub',
    consAddr: 'jpyxvalcons',
    consPub: 'jpyxvalconspub',
  },
  extension: {
    navigations: [
      {
        name: 'JPYX',
        link: '/jpyx',
      }
    ],
    messageActions: ['']
  }
};
