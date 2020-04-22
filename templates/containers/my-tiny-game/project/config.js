/**
 * @File   : config.js
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 8/14/2019, 8:05:26 PM
 * @Description:
 */
module.exports = {
  sourceDir: './',
  assetsDir: 'game/assets',
  meta: {
    DEV_DEPENDENCIES: {
      "seinjs-platform-webpack-plugin": "^0.8.0",
      "webpack-dev-server": "^3.8.2",
      "html-webpack-plugin": "^3.2.0"
    },
    DEPENDENCIES: {
      "seinjs-gui": "^0.8.0"
    },
    SCRIPTS: {
      dev: 'export NODE_ENV=development && webpack --watch --config ./webpack.config.js',
      'dev-web': 'export NODE_ENV=development;export IS_WEB=yes && node server.web.js',
      build: 'export NODE_ENV=production && webpack -p --config ./webpack.config.js'
    },
    WEBPACK_FILE_PREFIX: `
      const SeinJSPlatformPlugin = require('seinjs-platform-webpack-plugin');
      const HtmlWebpackPlugin = require('html-webpack-plugin');

      const isWeb = !!process.env.IS_WEB;
      const entry = isWeb ? 'web/index.ts' : 'game/index.ts';
    `,
    WEBPACK_MAIN_ENTRY_PREFIX: ``,
    WEBPACK_MAIN_ENTRY: '${entry}',
    WEBPACK_OUTPUT_PATH: 'dist/sein-game',
    WEBPACK_OUTPUT_NAME: 'index.js',
    WEBPACK_OUTPUT_CHUNKNAME: '[name].js',
    WEBPACK_PUBLIC_PATH: '${isWeb ? \'/\' : \'/sein-game/\'}',
    WEBPACK_ASSETS_PATH: 'game/assets',
    WEBPACK_OUTPUT_POSTFIX: `
      libraryTarget: isWeb ? undefined : 'commonjs2'
    `,
    WEBPACK_LOADER_POSTFIX: ``,
    WEBPACK_PLUGIN_POSTFIX: `
      !isWeb && new SeinJSPlatformPlugin({platform: 'my-tiny-game'}),
      isWeb && new HtmlWebpackPlugin({
        template: './web/index.html'
      }),
    `,
  }
}
