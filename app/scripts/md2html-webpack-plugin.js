import fs from 'fs'
import path from 'path'
import colors from 'colors-console'
import {
  readdir
} from 'fs/promises'
import marked from 'marked'
import hljs from 'highlight.js'


marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, {
      language
    }).value
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

// 创建多级目录
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      console.log('mkdirsSync:', dirname)
      return true;
    }
  }
}

const statistics = {
  articleCount: 0,
  categorys: [],
  keywords: [],
  articles: []
}

class md2htmlWebpackPlugin {
  constructor(options = {}) {

    Object.assign({
      template: 'app/index.html',
      input: 'app/article',
      output: 'dist',
      options: {}
    }, options);

    this.options = options;
  }

  async start() {
    const {
      template,
      input,
      output
    } = this.options

    this.template = fs.readFileSync(this.options.template, 'utf8')

    mkdirsSync(path.resolve(output))
    await this.walk(input)

    statistics.keywords = Array.from(new Set(statistics.keywords))
    statistics.articleCount = statistics.articles.length
    statistics.articles = statistics.articles.sort((a, b) => {
      return b.createAt - a.createAt
    })

    fs.writeFileSync(path.join(output, 'articles.json'), JSON.stringify(statistics, null, 2))
    // fs.writeFileSync(path.join(path.dirname(input), 'statistics.json'), JSON.stringify(statistics, null, 2))

    statistics.categorys.forEach(category => {
      const articles = statistics.articles.filter(article => article.category === category)
      this.createArticlesHtml(path.join(output, `${category}.html`), articles)
    })

    this.createArticlesHtml(path.join(path.dirname(template), 'index.html'), statistics.articles.slice(0, 20))
  }

  createArticlesHtml(filepath, articles) {
    const content = articles.map((article) => {
      const date = new Date(article.createAt)
      return `
        <div class="article article-item">
          <div class="date">${date.getDate()}<small>${date.getFullYear()}.${date.getMonth() + 1}</small></div>
          <div class="time">${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}</div>
          <h2><a href="${article.link}">${article.title}</a></h2>
          <p>${article.desc}</p>
          <div class="tags">${article.keywords.map(k => `<span>${k}</span>`).join('')}</div>
        </div>
      `
    }).join('')

    const htmlContent = this.template
      // 替换SEO关键字
      .replace('<%=Md2HtmlWebpackPlugin.title%>', "Alvin's blog")
      .replace('<%=Md2HtmlWebpackPlugin.keywords%>', '你爱谁如鲸向海, alvin, 前端开发, 开发者, 博客')
      .replace('<%=Md2HtmlWebpackPlugin.description%>', '你爱谁如鲸向海的前端开发博客，分享前端开发和计算机相关的知识')
      .replace('<%=Md2HtmlWebpackPlugin.body%>', content)

    fs.writeFileSync(filepath, htmlContent)
  }

  async walk(dir) {
    const {
      input,
      output
    } = this.options
    const category = path.basename(dir)

    try {
      const files = await readdir(dir)

      const asyncQueue = []

      await files.forEach((file) => {
        const currentPath = path.join(dir, file)
        const isDirectory = fs.lstatSync(currentPath).isDirectory()
        if (isDirectory) {
          const targetPath = currentPath.replace(input, output)
          // 如果是目录，在 output 中创建对应目录
          if (!fs.existsSync(targetPath)) {
            mkdirsSync(targetPath)
          }
          statistics.categorys.push(file)

          asyncQueue.push(this.walk(path.join(dir, file)))
        } else {
          asyncQueue.push(this.createHtml(currentPath, category))
        }
      })

      await Promise.all(asyncQueue)
      return files
    } catch (err) {
      console.error(err);
      return err
    }
  }

  async createHtml(filePath, category) {
    // console.log(`\n${colors('yellow', 'Start creating HTML')}:`, filePath)

    if (!/\.md$/.test(filePath)) {
      return false
    }

    const {
      input,
      output
    } = this.options

    const mdContent = fs.readFileSync(filePath, 'utf8')

    // console.log("mdContent", mdContent)

    const result = mdContent.match(/## Keywords(\s)+(`.+`)+/g)

    let keywords = []

    if (result) {
      keywords = result[0].match(/`([^`]+)`/g).map(s => s.slice(1, -1))
      statistics.keywords.push(...keywords)
    }

    let htmlContent = marked(mdContent)

    // 匹配出第一个 <h1> 和第一个 <P>, 作为标题和摘要
    const titleReg = new RegExp('<h1[^>]+>([^<]+)</h1>', 'g')
    const descReg = new RegExp('<p>(.*?)</p>')
    const titleResult = titleReg.exec(htmlContent)
    const descResult = descReg.exec(htmlContent)

    const title = titleResult ? titleResult[1] : ''
    const desc = descResult ? descResult[1] : ''

    let createAt

    const createAtResult = mdContent.match(/<!-- createAt ([\d-:]+ [\d-:]+) -->/)

    try {
      createAt = new Date(createAtResult[1]).getTime()
    } catch (err) {
      createAt = fs.statSync(filePath).ctimeMs || ''
    }

    const link = filePath.replace(path.dirname(input), '').replace(/\.md$/, '.html')

    if (title && desc) {
      const article = {
        title,
        desc,
        category,
        keywords,
        link,
        createAt
      }

      statistics.articles.push(article)
      // console.log("Added Article:", article)
    }

    htmlContent = this.template
      // 替换SEO关键字
      .replace('<%=Md2HtmlWebpackPlugin.title%>', title)
      .replace('<%=Md2HtmlWebpackPlugin.keywords%>', keywords.join(','))
      .replace('<%=Md2HtmlWebpackPlugin.description%>', desc)
      .replace('<%=Md2HtmlWebpackPlugin.body%>', `<article id="markdownSection" class="markdown-section article">${htmlContent}</article>`)

    // console.log("htmlContent", htmlContent)

    // console.log("currentPath.replace(input, output)", filePath.replace(input, output));

    const newFile = filePath.replace(input, output).replace(/\.md$/, '.html')

    fs.writeFileSync(newFile, htmlContent)

    console.log('HTML created successfully:', `${colors('green', filePath)}`)
  }

  apply(compiler) {
    console.log('\nStart conversion...\n')
    const onEnd = async () => {
      await this.start();
      console.log('\nConversion complete!\n')
    };

    // 在构建完成后打包
    compiler.hooks.afterEmit.tapPromise('md2htmlWebpackPlugin', onEnd)
  }
}

module.exports = md2htmlWebpackPlugin