import { withPolyfills, makeConfig } from "@haul-bundler/preset-0.60";

export default makeConfig({
  bundles: {
    index: {
      entry: withPolyfills('./index.js'),
      transform({ config }) {
        config.module.rules = [
          ...config.module.rules,
          {
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
          }
        ];
      },
    },
  },
});
