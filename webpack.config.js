const path = require('path');
//html打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
//打包清除插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.ts',   // 打包对入口文件，期望打包对文件入口
  output: {
    filename: 'index.[contenthash].js',   // 输出文件名称
    // chunkFilename: '[name].chunk.js', // 固定块文件名
    path: path.resolve(__dirname, 'dist'),  //获取输出路径
    // publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    // extensions：引入模块时不带扩展
    // 原来：import File from '../path/to/file.js'
    // 现在：import File from '../path/to/file'
    extensions: ['.ts', '.js', '.tsx', '.scss']      // 解析对文件格式
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.[contenthash].css',
      // chunkFilename: '[id].css'
    }),
    require('autoprefixer')
  ],
  devServer: {
    port: 8080, // 指定端口号
  }
}
