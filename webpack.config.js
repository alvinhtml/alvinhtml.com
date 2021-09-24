// 运行时进行即时编译 https://www.babeljs.cn/docs/babel-register
require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-regenerator'
  ],
  // https://babeljs.io/docs/en/babel-preset-typescript
  extensions: ['.js', '.ts', '.tsx']
})

/*!
 * 处理不能正确认别 import xx from 'xx.jpg' 的问题
 * https://github.com/webpack-contrib/file-loader/issues/271
 * https://stackoverflow.com/questions/33324435/how-to-ignore-non-js-files-with-babel-register
 */
require.extensions['.jpg'] = () => {}
require.extensions['.jpeg'] = () => {}
require.extensions['.gif'] = () => {}
require.extensions['.png'] = () => {}
require.extensions['.svg'] = () => {}


const path = require('path')
const webpack = require('webpack') // webpack 插件
const dotenv = require('dotenv').config()
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离 css 文件，使用这个插件需要单独配置 JS 和 CSS 压缩
const Md2HtmlWebpackPlugin = require('./app/scripts/md2html-webpack-plugin.js')
const { header, banner, sidebar, rightSidebar } = require('./app/scripts/render.js')

const ASSET_PATH = process.env.ASSET_PATH || '/'

const config = {

  mode: process.env.NODE_ENV,

  // 源码映射，生成一个映射文件，帮我们定位源码文件
  devtool: 'source-map',

  entry: {
    index: ['./app/scripts/main']
  },

  output: {
    filename: '[name].js', // 打包后的文件名
    path: path.resolve(__dirname, './dist'), // 路径必须是绝对路径,
    assetModuleFilename: '[hash][ext][query]', // 自定义输出文件名
    clean: true,
    publicPath: ASSET_PATH
  },

  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      '~': path.resolve(__dirname, './app'),
      'images': path.resolve(__dirname, './app/images')
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
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024 //4kb
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
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
  filename: 'md.html',
  hash: true,
  chunks: ['index'],
  title: '<%=Md2HtmlWebpackPlugin.title%>',
  header: header,
  banner: banner,
  left: sidebar,
  right: rightSidebar,
  body: '<%=Md2HtmlWebpackPlugin.body%>',
  keywords: '<%=Md2HtmlWebpackPlugin.keywords%>',
  description: '<%=Md2HtmlWebpackPlugin.description%>'
}

const plugins = [ // 数组，放着所有 webpack 插件
  // new webpack.DefinePlugin({
  //   'process.env.ASSET_PATH': JSON.stringify('http://localhost:8020'),
  // }),
  new HtmlWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].min.css'
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

  config.devtool = false;

  const md2HtmlPlugin = new Md2HtmlWebpackPlugin({
    template: 'dist/md.html',
    input: 'app/article',
    output: 'dist/article',
  })
  plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig))
  plugins.push(md2HtmlPlugin)
} else {
  plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig))
  config.devServer = devServer
}

config.plugins = plugins
module.exports = config
