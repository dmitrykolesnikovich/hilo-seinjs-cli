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
      "seinjs-platform-webpack-plugin": "^0.8.0"
    },
    DEPENDENCIES: {
      "seinjs-my-tiny-program-component": "^0.8.0",
      "seinjs-tiny-program-hud": "^0.8.0"
    },
    SCRIPTS: {
      dev: 'export NODE_ENV=development && webpack --watch --config ./webpack.config.js',
      build: 'export NODE_ENV=production && webpack -p --config ./webpack.config.js'
    },
    WEBPACK_FILE_PREFIX: `
      const SeinJSPlatformPlugin = require('seinjs-platform-webpack-plugin');
    `,
    WEBPACK_MAIN_ENTRY_PREFIX: ``,
    WEBPACK_MAIN_ENTRY: 'game/index.ts',
    WEBPACK_OUTPUT_PATH: 'sein-game',
    WEBPACK_OUTPUT_NAME: 'index.js',
    WEBPACK_OUTPUT_CHUNKNAME: '[name].js',
    WEBPACK_PUBLIC_PATH: '/sein-game/',
    WEBPACK_ASSETS_PATH: 'game/assets',
    WEBPACK_OUTPUT_POSTFIX: `
      libraryTarget: 'commonjs2'
    `,
    WEBPACK_LOADER_POSTFIX: ``,
    WEBPACK_PLUGIN_POSTFIX: `
      new SeinJSPlatformPlugin({platform: 'my-tiny-program'})
    `,
  }
}
