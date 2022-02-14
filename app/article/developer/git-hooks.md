# 在项目中使用 Git Hooks

在日常开发中，我们通常会使用 git 来管理我们的项目，并在开发过程中使用 commit 、 push 等命令提交和推送代码，如果我们想在每次提交时都执行代码检查，我们如何自动化的去完成这些任务呢？

还好 git 为我们提供了 hooks 脚本，这些脚本在指定的某些事件之前或之后执行，比如你希望在每次 commit 的时候，执行 eslint 代码检查，只需要在对应的脚本文件中编写代码就能实现。

## Git Hooks 工作原理

当我们使用 `git init` 初始化一个项目的时候，就会在项目目录下创建一个 `.git` 目录，这个目录是个隐藏文件夹，在 windows 中需要显示隐藏文件，在 mac 或 linux 中要使用 `ls -a` 才能看到，`.git` 存放的就是 git 仓库的所有数据，如果 `.git` 丢失，你本地仓库的历史数据也就丢失了。

在 `.git` 中有个 hooks 目录，这个目录下有一些示例脚本，并且以 `.sample` 为后缀，而且只有去掉 `.sample` 后缀，脚本文件才会执行。

常用的 hooks 有：

- pre-commit：提交时运行，可以用来检查代码或提交信息；
- post-commit：提交过程完成后运行，可以用来做发送通知之类的事情；
- pre-receive：处理来自客户端的推送操作时运行；
- post-receive：推送过程完成后运行，可以用于将代码部署到生产环境；

你可以根据需要随意修改这些脚本，当这些事件发生时 Git 会执行对应的脚本，更多 hooks 可以参考 [https://githooks.com](https://githooks.com/)。

## 使用 pre-commit 运行 eslint

知道了 Git Hooks 的工作原理后，我们尝试编写一个 git hooks，大多数前端项目，都会在 commit 前运行 `npm run eslint` 来检查代码是否符合预定的规范，如果每次都手动执行，显然比较麻烦，像这种重复性的工作，就可以放在利用 git hooks 来完成，因为我们是想在每次 commit 的时候执行检查，所以直接找到 `.git/hooks/pre-commit.sample` 文件，将 `.sample` 后缀去掉，并将内容改成如下代码：

```bash
#!/bin/sh
npm run eslint
```

这样在每次提交代码前，就会执行代码检查，当然前提是你项目中配置了 eslint。

## 在前端项目中使用 Git Hooks

虽然我们可以直接编写 hooks 脚本来完成一些任务，但当我们需要经常修改这些任务，或有多个任务要执行的时候，这种方式就会变的不那么方便，而且每个任务的输出结果，在终端上显示的也比较杂乱。开源社区为我们提供了可以将 hooks 写在 package.json 上的工具。

- yorkie 允许我们在 package.json 中编写 hooks
- lint-staged 可以将代码检查拆分成不同的步骤，并且在终端上输出美化后的信息，更加直观的显示每个步骤的执行情况。

安装 yorkie 和 lint-staged：

````bash
npm install yorkie lint-staged --save-dev
```

然后在 package.json 中加入如下代码，其中 lint-staged 根据你的 eslint 配置调整：

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"],
    "*.scss": ["stylelint", "prettier --write"],
    "*.vue": ["eslint --fix", "prettier --write"]
  }
}
````

这样就不用每次去修改脚本文件了。

## 结束语

git hooks 除了自动执行代码检查，发送通知外，还可以和你的持续集成服务结合起来，做自动化打包部署等工作，合理的利用 git hooks 可以极大地提高开发人员的工作效率。

## 参考

- [githooks.com](https://githooks.com/)

## Keywords

`git` `hooks` `yorkie` `lint-staged` `gitHooks`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2022-02-14 15:24:00 -->
<!-- updateAt 2022-02-14 15:24:00 -->
