const UnoCSS = require('@unocss/webpack').default

module.exports = {
  configureWebpack: {
    // resolve: {
    //   symlinks: false,
    // },
    plugins: [
      new UnoCSS(),
    ],
  },
  css: {
    extract: {
      filename: '[name].[hash:9].css',
    },
  },
}
