import CompressionPlugin from "compression-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
//@ts-ignore
import DashboardPlugin from "webpack-dashboard/plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import path from "path"
import webpack from "webpack"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

// const mode: webpack.Configuration["mode"] = "production"
// const base = path.resolve(__dirname, "kaleidoscope-page")

const mode: webpack.Configuration["mode"] = "development"
const base = path.resolve(__dirname, "out")

const exclude = ["fs", "crypto", "utils", "os"]
const entry = path.resolve(__dirname, "page/index.tsx")

const config: webpack.Configuration = {
  mode,
  entry,
  externals: exclude.reduce(
    (acc, curr) => Object.assign(acc, { [curr]: `root ${curr}` }),
    {},
  ),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]",
              },
              localsConvention: "camelCaseOnly",
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
      {
        test: /\.(fsh|vsh)$/,
        use: "raw-loader",
      },
      {
        test: /\.exec\.js$/,
        use: "script-loader",
      },
    ],
  },
  output: {
    path: base,
  },
  plugins: [
    new DashboardPlugin({}),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
    new CompressionPlugin({}),
    new MiniCssExtractPlugin({}),
    new HtmlWebpackPlugin({
      cache: true,
      xhtml: true,
      inject: "head",
      title: "Kaleidoscope",
      meta: {
        viewport: "width=device-width, initial-scale=1",
      },
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "./_locales"), to: base },
    ]),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "./out/main.wasm"), to: base },
    ]),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
  },
  devServer: {
    disableHostCheck: true,
    contentBase: "out",
    hot: true,
    overlay: true,
    compress: true,
    writeToDisk: true,
    host: "0.0.0.0",
    port: 80,
  },
}

export default config
