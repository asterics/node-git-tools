const { resolve } = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "index.node.js",
    library: "@asterics/git-tools",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "maintained node versions",
                  modules: "umd",
                  debug: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true, sourceMap: true })]
  }
};
