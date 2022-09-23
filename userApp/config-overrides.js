const { override, useBabelRc, adjustWorkbox, addWebpackAlias } = require('customize-cra');
const { addReactRefresh } = require("customize-cra-react-refresh");
const APP = require('../settings/app.json');

const { ENDPOINT: { HOST, PORT, PROTOCOL } } = APP;

/* config-overrides.js */

module.exports = {
  webpack: override(
    useBabelRc(),
    adjustWorkbox(wb => 
      Object.assign(wb, {
        skipWaiting: true,
        clientsClaim: true
      })),
    process.env.NODE_ENV !== 'development' && addReactRefresh(),
    addWebpackAlias({
      'react-dom': '@hot-loader/react-dom'
    })
  ),
  // {
  //   config = injectBabelPlugin("styled-jsx/babel", config);
  //   config = injectBabelPlugin(rootImport, config);
  //   return config;
  // },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.proxy.forEach(p => {
        if (p.target ==='https://graphql') {
          p.target = `${PROTOCOL}://${HOST}:${PORT}`;
        }
      });
      return config;
    };
  }
};
