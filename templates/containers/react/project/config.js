/**
 * @File   : config.js
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 8/14/2019, 10:41:16 PM
 * @Description:
 */
const config = Object.assign({}, require('../../none/project/config'));
config.meta = Object.assign({}, config.meta);

config.meta.DEPENDENCIES = {
  "react": "^16.7.0",
  "react-dom": "^16.7.0",
  "@types/react": "^16.7.22",
  "@types/react-dom": "^16.0.11",
};

config.meta.WEBPACK_MAIN_ENTRY_PREFIX = `
isDev && 'react-hot-loader/patch',${config.meta.WEBPACK_MAIN_ENTRY_PREFIX}
`;

config.meta.WEBPACK_MAIN_ENTRY = 'src/index.tsx';

module.exports = config;
