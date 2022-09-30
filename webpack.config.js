/* eslint-disable import/order */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const slsw = require("serverless-webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const copyPlugin = require("copy-webpack-plugin");

const entries = {};

Object.keys(slsw.lib.entries).forEach(key => (entries[key] = ["./source-map-install.js", slsw.lib.entries[key]]));

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new copyPlugin({
      patterns: [{ from: "config", to: "config" }]
    })
  ]
};
