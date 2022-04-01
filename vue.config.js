const path = require('path');

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: 'http://api-staging.liberrex.com/'
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@config": path.resolve(__dirname, 'src/_configs/'+process.env.VUE_APP_USED_CONFIG)
      }
    }
  }
}