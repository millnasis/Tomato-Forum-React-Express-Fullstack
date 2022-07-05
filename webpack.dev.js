const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

const miniCssExtractPlugin = require("mini-css-extract-plugin");

const { resolve } = require("path");

module.exports = {
  entry: ["../src/index.jsx", "../src/index.html"],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "./server/public"),
    publicPath: "/public",
    clean: false,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.less$/,
            use: [
              miniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "less-loader",
                options: {
                  lessOptions: {
                    modifyVars: {
                      "primary-color": "rgb(128,0,32)",
                      "link-color": "rgb(128,0,32)",
                      "layout-header-background": "rgb(76,0,9)",
                    },
                    javascriptEnabled: true,
                  },
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                  },
                },
              },
            ],
          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              miniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [["postcss-preset-env"]],
                  },
                },
              },
            ],
          },
          {
            test: /\.(m?js)|(jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: ["react-hot-loader/babel"],
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: {
                      version: 3,
                    },

                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17",
                    },
                  },
                ],
                ["@babel/preset-react"],
              ],
            },
          },
          {
            test: /\.(jpg|png|gif|svg|jpeg)$/,
            type: "asset/resource",

            generator: {
              filename: "img/[hash][ext]",
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
            generator: {
              filename: "media/[hash][ext]",
            },
          },
          {
            test: /\.html$/,
            use: ["html-loader"],
          },
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "../src/index.html",
      filename: "../views/index.html",
    }),
    new miniCssExtractPlugin({ filename: "css/[name].css" }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    compress: true,
    port: 8000,
    open: true,
    hot: true,
  },
  mode: "development",
  resolve: {
    alias: {
      $css: path.resolve(__dirname, "src/css"),
    },
    extensions: [".jsx", ".js"],
  },
};
