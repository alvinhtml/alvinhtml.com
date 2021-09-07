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
  highlight: function(code, lang) {
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
      return true;
    }
  }
}

class md2htmlWebpackPlugin {
  constructor(options = {}) {

    Object.assign({
      template: 'app/index.html',
      input: 'app/blog',
      output: 'dist',
      options: {}
    }, options);

    this.options = options;
  }

  async start() {
    const {
      input,
      output,
      options
    } = this.options

    this.template = fs.readFileSync(this.options.template, 'utf8')

    // console.log('\nReading html file...\n');

    // const contentHtml = fs.readFileSync(input, 'utf8')

    // console.log(`\n${colors('green', input)} -> ${colors('green', output)}\n`);

    await this.walk(input)
  }

  async walk(dir) {
    const {input, output} = this.options

    try {
      const files = await readdir(dir)
      console.log("files", files);
      files.forEach((file, i) => {
        const currentPath = path.join(dir, file)
        const isDirectory = fs.lstatSync(currentPath).isDirectory()
        if (isDirectory) {
          const targetPath = currentPath.replace(input, output)
          // 如果是目录，在 output 中创建对应目录
          if (!fs.existsSync(targetPath)) {
            mkdirsSync(targetPath)
          }

          console.log("folder:", file);
          this.walk(path.join(dir, file))
        } else {
          this.createHtml(currentPath)
        }
      })
    } catch (err) {
      console.error(err);
    }
  }

  async createHtml(filePath) {
    const {input, output} = this.options

    const mdContent = fs.readFileSync(filePath, 'utf8')

    console.log("mdContent", mdContent)

    // 使用正则匹配出SEO关键字
    const result = mdContent.match(/## Keywords(\s)+(\s*(- ([\w]+))(\s)*)+/g)
    const keywords = result ? result[0].match(/(?<=- )([\w]+)/g).join(',') : ''

    let htmlContent = marked(mdContent)

    console.log("micromark", htmlContent)

    htmlContent = this.template
      // 替换SEO关键字
      .replace('<%=Md2HtmlWebpackPlugin.keywords%>', keywords)
      .replace('<%=Md2HtmlWebpackPlugin.body%>', htmlContent)

    console.log("htmlContent", htmlContent)

    console.log("currentPath.replace(input, output)", filePath.replace(input, output));

    const newFile = filePath.replace(input, output).replace(/\.md$/, '.html');
    console.log("newFile", newFile);

    fs.writeFileSync(newFile, `<section class="markdown-section">${htmlContent}</section>`)

  }

  apply(compiler) {
    console.log('\nStart conversion...\n')
    const onEnd = async () => {
      await this.start();
      console.log('Conversion complete!\n')
    };

    // 在构建完成后打包
    compiler.hooks.afterEmit.tapPromise('md2htmlWebpackPlugin', onEnd)
  }
}

export default md2htmlWebpackPlugin
