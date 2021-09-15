import path from 'path'
import webpack from 'webpack' // webpack 插件
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin' // 抽离 css 文件，使用这个插件需要单独配置 JS 和 CSS 压缩
import UglifyJsPlugin from 'uglifyjs-webpack-plugin' // 压缩 JS
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin' // 压缩 CSS
import Md2HtmlWebpackPlugin from './app/scripts/md2html-webpack-plugin.js'
import dotenv from 'dotenv'

dotenv.config()

const ASSET_PATH = process.env.ASSET_PATH || '/'
const __dirname = path.dirname('')

console.log("ASSET_PATH", ASSET_PATH);



const config = {

  mode: process.env.NODE_ENV,

  devtool: 'source-map',

  entry: {
    index: ['./app/scripts/main']
  },

  output: {
    filename: '[name].js', // 打包后的文件名
    path: path.resolve(__dirname, './dist'), // 路径必须是绝对路径
    publicPath: ASSET_PATH
  },

  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      '~': path.resolve(__dirname, './app/scripts/')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'] // 配置省略后缀名
  },

  module: { // 模块

    rules: [ // 规则
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./node_modules/normalize-scss/sass']
              },
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(jpg|png|gif|jpeg|bmp|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 500 * 1024,
            outputPath: './assets',
          }
        }
      },
      {
        test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      }
    ]
  },

  // watch: true,
  // watchOptions: {
  //     poll: 2000, // 每秒问我多少次
  //     aggregateTimeout: 2000, // 防抖
  //     ignored: /node_modules|vendor|build|public|resources/
  // },
};

const htmlWebpackPluginConfig = {
  template: './app/index.html',
  filename: 'index.html',
  hash: true,
  chunks: ['index']
}

const plugins = [ // 数组，放着所有 webpack 插件
  new webpack.DefinePlugin({
    'process.env.ASSET_PATH': JSON.stringify('http://localhost:8020'),
  }),
  new HtmlWebpackPlugin({
    template: './app/index.html',
    filename: 'md.html',
    hash: true,
    chunks: ['index'],
    body: '<%=Md2HtmlWebpackPlugin.body%>',
    keywords: '<%=Md2HtmlWebpackPlugin.keywords%>',
    description: '<%=Md2HtmlWebpackPlugin.description%>'
  }),
  new MiniCssExtractPlugin({
    filename: '[name].min.css'
  }),
  new Md2HtmlWebpackPlugin({
    template: 'dist/md.html',
    input: 'app/test',
    output: 'dist/article',
  })
]

const devServer = {
  port: 8020,
  progress: true, // 进度条
  contentBase: './dist', // 配置目录
  open: false, // 在DevServer第一次构建完成时，自动用浏览器打开网页
  historyApiFallback: true,
  hot: true
}

if (process.env.NODE_ENV === 'production') {
  // 优化 html 文件
  htmlWebpackPluginConfig.minify = {
    removeComments: true,
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    collapseWhitespace: true
  }
  // 源码映射，生成一个映射文件，帮我们定位源码文件
  config.devtool = false;
} else {
  config.devServer = devServer;
}

plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig));

config.plugins = plugins;

export default config
