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
const FileManagerPlugin = require('filemanager-webpack-plugin')
const Md2HtmlWebpackPlugin = require('./app/scripts/md2html-webpack-plugin.js')
const {
  header,
  banner,
  sidebar,
  rightSidebar
} = require('./app/scripts/render.js')

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

const body = `
<div class="article article-item">
  <div class="date">1<small>121.11</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/linux/nginx-gzip.html">nginx 开启 gzip 压缩</a></h2>
  <p>nginx 开启 gzip 压缩功能可以使网站的 css、js、html 等文件在传输时进行压缩，提高访问速度，进而优化nginx性能，节省流量，一般 gzip 压缩只针对文本文件，而图片视频这些很难再进行压缩的文件，因为压缩效果不好，则没有必要开启 gzip 压缩，如果想优化图片的访问性能，可以在本地压缩，并设置较长一点的生命周期让客户端缓存。</p>
  <div class="tags"><span>nginx</span>,<span>gzip</span>,<span>gzip_min_length</span>,<span>gzip_types</span></div>
</div>

<div class="article article-item">
  <div class="date">5<small>121.11</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/algorithm/linked.html">JavaScript 中的链表</a></h2>
  <p>链表是一种数据结构，以线性方式存储多个值。链表中的每个值都包含在其自己的节点中，该对象包含数据以及指向列表中下一个节点的链接。链接是指向另一个节点对象的指针，如果没有下一个节点，链接指向 null。如果每个节点只有一个指向另一个节点的指针（最常称为 next ），则该列表被认为是单向链表（or just linked list），而如果每个节点有两个链接（通常是 previous 和 next），则它被认为是双向链表。在这篇文章中，我主要学习单向链表。</p>
  <div class="tags"><span>JavaScript</span>,<span>链表</span></div>
</div>

<div class="article article-item">
  <div class="date">4<small>121.11</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/linux/linux-command-by-nodejs.html">使用 Node.js 开发一个 Linux 命令行工具</a></h2>
  <p>Linux 命令可以使用 shell、python、go 等语言开发，也可以使用 Node.js，今天介绍怎么使用 Node.js 开发一个简单的 Linux 命令。</p>
  <div class="tags"><span>Linux</span>,<span>命令行</span>,<span>node</span>,<span>Node.js</span>,<span>commander</span>,<span>cli</span></div>
</div>

<div class="article article-item">
  <div class="date">4<small>121.11</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/linux/switch-to-root.html">Linux 系统切换到 root 用户</a></h2>
  <p>在 Linux 系统中需要 root 权限执行命令，有两种方式可以做到，一种是使用 <code>sudo</code> 临时切获得 root 用户的权限，一种是使用 <code>su</code> 切换到 root 用户。</p>
  <div class="tags"><span>linux</span>,<span>root</span>,<span>su</span>,<span>sudo</span>,<span>管理员权限</span>,<span>切换</span></div>
</div>

<div class="article article-item">
  <div class="date">0<small>121.10</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/algorithm/tree.html">JavaScript 中的树数据结构</a></h2>
  <p>树是一种有趣的数据结构。它在各个领域都有广泛的应用。</p>
  <div class="tags"><span>数据结构</span>,<span>二叉树</span>,<span>遍历</span></div>
</div>

<div class="article article-item">
  <div class="date">6<small>121.9</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/web/vite-proxy-https.html">vite 中配置 proxy 代理 https</a></h2>
  <p>在做前端开发的时候，我们通常是启动一个 node server 方便调试代码，并且能够支持热更新，但后端提供的 api 接口往往在另一台服务器上，这时候，就需要用到代理（proxy）。</p>
  <div class="tags"><span>vite</span>,<span>proxy</span>,<span>https</span></div>
</div>

<div class="article article-item">
  <div class="date">3<small>116.5</small></div>
  <div class="time">20:0</div>
  <h2><a href="/article/web/resolve-canvas-blur.html">Canvas画图模糊问题及解决方法</a></h2>
  <p>使用canvas画图时经常遇到画出来的图形模糊、边框不清晰等现象，曾经为了解决这些问题走了很多弯路，浪费了大把时间，当然也积累了一些经验，今天就把这些问题总结出来。</p>
  <div class="tags"><span>canvas</span>,<span>模糊</span></div>
</div>



`

const htmlWebpackPluginConfig = {
  template: './app/index.html',
  filename: 'index.html',
  // filename: 'md.html',
  hash: true,
  chunks: ['index'],
  title: '<%=Md2HtmlWebpackPlugin.title%>',
  header: header,
  banner: banner,
  left: sidebar,
  right: rightSidebar,
  // body: '<%=Md2HtmlWebpackPlugin.body%>',
  body: body,
  keywords: '<%=Md2HtmlWebpackPlugin.keywords%>',
  description: '<%=Md2HtmlWebpackPlugin.description%>'
}

const plugins = [ // 数组，放着所有 webpack 插件
  // new webpack.DefinePlugin({
  //   'process.env.ASSET_PATH': JSON.stringify('http://localhost:8020'),
  // }),
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
  plugins.push(new FileManagerPlugin({
    events: {
      onEnd: {
        copy: [{
            source: path.resolve(__dirname, 'app/images'),
            destination: path.resolve(__dirname, 'dist/images')
        },{
            source: path.resolve(__dirname, 'app/images/theme/logo.png'),
            destination: path.resolve(__dirname, 'dist/favicon.png')
        }]
      }
    }
  }))
  plugins.push(md2HtmlPlugin)
} else {
  plugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig))
  config.devServer = devServer
}

config.plugins = plugins
module.exports = config
