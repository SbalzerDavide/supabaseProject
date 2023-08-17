// module.exports = {
//   // module:{
//   //   rules: [
//   //     // ... other rules omitted
  
//   //     // this will apply to both plain `.scss` files
//   //     // AND `<style lang="scss">` blocks in `.vue` files
//   //     {
//   //       test: /\.scss$/,
//   //       use: [
//   //         'vue-style-loader',
//   //         'css-loader',
//   //         'sass-loader'
//   //       ]
//   //     }
//   //   ]
//   // }
// }
var path = require('path')

module.exports = {
  // options...
  publicPath: "",
  pages: {
    index:{
      entry: 'src/main.js',
      template: 'public/index.html'
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src')
      }
    },
  },
  devServer: {
    watchOptions: {
      poll: true, // or use an integer for a check every x milliseconds, e.g. poll: 1000,
      ignored: /node_modules/ // otherwise it takes a lot of time to refresh
    }
  },
  //devServer: { https: true },
  indexPath: 'index.html',
  // serve a non produrre .map
  productionSourceMap: false,
  //
  // configureWebpack: {
  //   plugins: [
  //     new webpack.optimize.LimitChunkCountPlugin({
  //       maxChunks: 1,
  //     }),
  //   ],
  //   output: {
  //     filename: "./scripts/wg.powerb.v.min.js",
  //   },
  //   optimization: {
  //     splitChunks: false,
  //   },
  // },
  // css: {
  //   extract: {
  //     filename: "./css/wg.powerb.v.min.css",
  //   },
  // },
  // filenameHashing: false,
};