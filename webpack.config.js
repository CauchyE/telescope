module.exports = {
  resolve: {
    extensions: ['.wasm'],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      global: 'empty',
      clearImmediate: 'empty',
      setImmediate: 'empty',
      module: false,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
