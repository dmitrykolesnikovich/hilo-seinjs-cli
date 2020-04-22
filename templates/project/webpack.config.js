/**
 * @File   : webpack.config.js
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: 
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PNGCompressProcessor = require('seinjs-png-compress-processor');

const pngCompressProcessor = new PNGCompressProcessor({
  psize: 240,
  custom: (fp, data) => {
    const kbs = data.buffer.length / 8 / 1024;
    console.log(kbs);
    if (kbs <= 20) {
      return {skip: true};
    }
  }
});

{{WEBPACK_FILE_PREFIX}}
const Mode = process.env.NODE_ENV;
const isDev = Mode !== 'production';

const outPath = path.resolve(__dirname, `{{WEBPACK_OUTPUT_PATH}}`);

module.exports = {
  mode: Mode,
  devtool: 'none',

  entry: {
    main: [
      {{WEBPACK_MAIN_ENTRY_PREFIX}}
      path.resolve(__dirname, `{{WEBPACK_MAIN_ENTRY}}`)
    ].filter(s => !!s)
  },

  output: {
    path: outPath,
    filename: `{{WEBPACK_OUTPUT_NAME}}`,
    chunkFilename: `{{WEBPACK_OUTPUT_CHUNKNAME}}`,
    publicPath: `{{WEBPACK_PUBLIC_PATH}}`,
    {{WEBPACK_OUTPUT_POSTFIX}}
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, `{{WEBPACK_ASSETS_PATH}}`)
    }
  },
  
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          },
          {
            loader: 'tslint-loader',
            query: {
              configFile: path.resolve(__dirname, './tslintConfig.js')
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'seinjs-url-loader',
          options: {
            enabled: true,
            base64: {
              threshold: 10000
            },
            process: {
              enabled: false,
              processors: [pngCompressProcessor]
            },
            publish: {
              enabled: false,
              publisher: null
            }
          }
        }
      },
      {
        test: /\.(gltf|glb)$/,
        use: {
          loader: 'seinjs-gltf-loader',
          options: {
            compress: {
              enabled: true,
              excludes: [/miku/g]
            },
            compressTextures: {
              enabled: false,
              excludes: []
            },
            glb: {
              enabled: false
            },
            base64: {
              enabled: false
            },
            process: {
              enabled: false,
              processors: [pngCompressProcessor]
            },
            publish: {
              enabled: false,
              publisher: null
            }
          }
        }
      },
      {
        test: /\.atlas$/,
        use: {
          loader: 'seinjs-atlas-loader',
          options: {
            base64: {
              enabled: false
            },
            process: {
              enabled: false,
              processors: [pngCompressProcessor]
            },
            publish: {
              enabled: false,
              publisher: null
            }
          }
        }
      },
      {{WEBPACK_LOADER_POSTFIX}}
    ]
  },

  optimization: {
    splitChunks: {
      minChunks: 1,
      cacheGroups: {
        seinjs: {
          name: 'seinjs',
          chunks: 'initial',
          test: m => {
            if (m.external) {
              return false;
            }

            return m.rawRequest === 'seinjs' || m.rawRequest === 'seinjs-orig';
          },
          priority: 2
        },
        common: {
          name: 'common',
          chunks: 'initial',
          test: /(node_modules|utils)/,
          priority: 1
        }
      }
    }
  },

  plugins: [
    new CleanWebpackPlugin(
      ['*'],
      {root: outPath}
    ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(Mode)
      }
    }),
    {{WEBPACK_PLUGIN_POSTFIX}}
  ].filter(s => !!s)
};
