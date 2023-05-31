const path = require('path');  // node自带包
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.ts',   // 打包对入口文件，期望打包对文件入口
  output: {
    filename: 'index.js',   // 输出文件名称
    path: path.resolve(__dirname, 'dist')  //获取输出路径
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    // extensions：引入模块时不带扩展
    // 原来：import File from '../path/to/file.js'
    // 现在：import File from '../path/to/file'
    extensions: ['.ts','.js','.tsx']      // 解析对文件格式
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 8080, // 指定端口号
  }
}
