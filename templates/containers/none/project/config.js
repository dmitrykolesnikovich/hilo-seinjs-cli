/**
 * @File   : config.js
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 8/14/2019, 8:05:26 PM
 * @Description:
 */
module.exports = {
  meta: {
    DEV_DEPENDENCIES: {
      "html-webpack-plugin": "^3.2.0",
      "node-sass": "^4.7.2",
      "postcss-loader": "^2.0.10",
      "postcss-smart-import": "^0.7.6",
      "precss": "^2.0.0",
      "react-hot-loader": "^3.1.3",
      "sass-loader": "^6.0.6",
      "style-loader": "^0.19.1",
      "mini-css-extract-plugin": "^0.8.0",
      "autoprefixer": "^7.2.4",
      "css-loader": "^0.28.8",
      "extract-text-webpack-plugin": "^3.0.2",
      "webpack-dev-server": "^2.10.1",
    },
    DEPENDENCIES: {},
    WEBPACK_FILE_PREFIX: `
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    `,
    WEBPACK_MAIN_ENTRY_PREFIX: `
      isDev && 'webpack-dev-server/client?/',
      isDev && 'webpack/hot/dev-server',
    `,
    WEBPACK_MAIN_ENTRY: 'src/index.ts',
    WEBPACK_OUTPUT_POSTFIX: ``,
    WEBPACK_LOADER_POSTFIX: `
      {
        test: /.(css|scss)$/,
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
    `,
    WEBPACK_PLUGIN_POSTFIX: `
      isDev && new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
    `,
  }
}
