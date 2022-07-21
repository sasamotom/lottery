const webpack = require("webpack");
const devtool =
  process.argv[2] === "--mode=development" ? "cheap-module-source-map" : false;

module.exports = {
  entry: ["./src/assets/js/index.js", "./src/assets/ts/index.ts"],
  output: {
    path: __dirname,
    filename: "./htdocs/assets/js/app.js",
  },
  devtool: devtool,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },

    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: ["web", "es5"],
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
