module.exports = ({ platform }, defaults) => ({
  entry: `./index.js`,
  module: {
    ...defaults.module,
    rules: [
      ...defaults.module.rules,
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  }
});