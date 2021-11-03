# alvinhtml.com

纯静态页面个人博客网站，支持使用 markdown 写日志，在打包阶段将 `.md` 文件转化为 `.html` 文件，并使用脚本部署到线上环境。

网站地址：[Alvin的个人博客网站](http://www.alvinhtml.com/)

## Development

- Install npm packages

```
npm install
```

- Launch dev server

```
npm run build
npm run start
```

- Build

```
npm run build
```

## 技术现实思路

1. 网站公用部分，header 和 两侧导航使用 React 服务器端渲染，生成 html 页面， 保存为模板；
2. 编写 webpack 插件 `md2html-webpack-plugin`，实现以下功能：
  - 用 NodeJS 读取指定目录中的 `.md` 文件，然后通过 `marked` 转化为 `.html` 文件，并使用 `highlight.js` 实现代理高亮；
  - 将转化后的 `.html` 拼装到包含 header 的模板中，并保存到指定目录；
3. 拷贝 markdown 图片资源到指定目录；
4. 编写 `deploy.sh` 脚本将打包后的文件上传到线上环境。
