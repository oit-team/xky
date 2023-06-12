const MiniProgramTailwindWebpackPlugin = require('@dcasia/mini-program-tailwind-webpack-plugin')

module.exports = {
  transpileDependencies: ['mini-common'],
  configureWebpack: {
    plugins: [
      new MiniProgramTailwindWebpackPlugin({
        designWidth: 375,
      }),
    ],
  },
}
