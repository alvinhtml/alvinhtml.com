# 使用 Node.js 开发一个 Linux 命令行工具

Linux 命令可以使用 shell、python、go 等语言开发，也可以使用 Node.js，今天介绍怎么使用 Node.js 开发一个简单的 Linux 命令。

阅读本文你需要有一定的 Node.js 开发基础。

## package bin

在开如之前，让我们先来了解一下 `package.json` 的基础知识。

每个 Node.js 项目都有一个 package.json，package.json 中一个 bin 选项，这个选项是用来配置可执行文件的，当这个包被全局安装时，该文件将被链接到全局 `bin` 所在的位置，如此就相当于添加了一个命令，命令名称由 package bin 的配置所指定。

例如：

```json
{
  "name": "myapp-cli",
  "bin": {
    "myapp": "./cli.js"
  }
}
```

当你执行 `npm install myapp-cli -g` 全局安装 myapp-cli 时，npm 会创建一个从 `/usr/local/bin/myapp` 到 `cli.js` 的链接，这样以来，我们就可以使用 `myapp` 命令了。

看到这里，你应该明白为什么安装 `vue-cli` 后，就可以合用 `vue create` 等命令了吧。

注意，当包的名称和命令的名称相同时，package bin 配置可以简写成以下形式：

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "bin": "./cli.js"
}
```

### 让命令生效

当项目还处于开发阶段中，如何让我们的命令生效，以方便调试呢？有两种办法，一种是将当前项目全局安装，使用

```bash
npm install . -g
```

另一种更简单的办法是使用 `npm link`

```bash
npm link

# audited 1 package in 2.102s
# found 0 vulnerabilities

# /usr/local/bin/myapp -> /usr/local/lib/node_modules/myapp/cli.js
# /usr/local/lib/node_modules/myapp -> **/myapp
```

根据上面的输入信息，可以看到 `/usr/local/bin/myapp`，已经连接到了我们的 `myapp/cli.js`。调用 `myapp` 命令，就会去执行 `cli.js`。


到此，你已经大概知道命令是如何开发并生效的了，接下来，让我们看下 `cli.js` 应该如何写。

## 脚本中的头注释

脚本可以使用多种语言编写，比如 shell、python、Node.js，系统是怎么知道用什么解析器去执行这些脚本呢，聪明的你可能已经注意到，很多脚本的头部都会有这样一段信息

```bash
#!/bin/bash
```

这段信息被称为脚本头注释，是用来声明这个脚本是用什么语言来解析的。

当我们想用 node 运行一个 .js 文件时，我们一般这样运行 `node cli.js`。

如果我们在 `cli.js` 的头部加上 `#!/usr/bin/env node`，并将这个文件链接到  `/usr/local/bin/myapp` 后，调用 `myapp` 命令时，系统就会在环境变量中找 node ，并使用 node 来运行这个 js 文件，就不需要手动加 `node` 了。

介绍完了原理，让们在实践中验证一下吧。

## 一个最简单的脚本

我们先来创建一个最简单的脚本，用它来显示当前系统时间。

1. 创建一个 `showtime` 文件夹，并 `cd` 到文件夹下使用 `npm init` 创建一个新项目，`package.json` 配置如下：

```json
{
  "name": "showtime",
  "version": "1.0.0",
  "description": "displays the current system time",
  "main": "index.js",
  "bin": "index.js"
}
```

2. 在 `showtime` 文件夹下创建一个 `index.js`

```js
#!/usr/bin/env node
console.log(new Date())
```

3. 执行 `npm link`，然后执行 showtime

```bash
npm link

# up to date in 3.23s
# found 0 vulnerabilities

# /usr/local/bin/showtime -> /usr/local/lib/node_modules/showtime/index.js
# /usr/local/lib/node_modules/showtime -> **/showtime

showtime
# 2021-11-19T05:07:19.398Z
```

可以看到输出时间 `2021-11-19T05:07:19.398Z`


## 给命令添加参数

我们希望命令能够做更复杂的事情，比如通过传入的参数，来显示日期或时间。

获取参数，需要用到 process 对象，process 是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。因为是全局变量，所以无需使用 `require()` 导入。

process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。第二个元素将是正在执行的 JavaScript 文件的路径。其余元素将是任何其他命令行参数。

也就是说，`process.argv` 数组前两个是固定的，后面就是我们传入的参数，我们可以通过 `process.argv[2]` 来获取参数。

修改我们的 `index.js` 文件

```js
#!/usr/bin/env node

const arg = process.argv[2]
const date = new Date()

if (arg === '--date') {
  console.log(`${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}`)
} else if (arg === '--time') {
  console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
} else {
  console.log(date)
}
```

调用 showtime 命令

```bash
showtime --date
# 121-11-19
showtime --time
# 13:42:48
showtime
# 2021-11-19T05:42:52.880Z
```

如果参数的个数非常多，解析这些参数就会变的非常复杂，还好 npm 上已经有很多开源的库，使用这些开源库，能帮我们省去很多事情，目前比较流行的库有两个 `commander` 和 `yargs`

## commander

打开 [https://www.npmjs.com/](https://www.npmjs.com/package/commander) 搜索 `commander` 查看介绍。

安装 commander

```bash
npm i commander --save
```

然后修改我们的 `index.js` 文件，完整的代码，在后面查看

首先使用 require 导入 commander

```js
const program = require('commander')
```

然后调用 program 的 `version()` 方法和 `parse()` 方法。

```js
program
  .version('1.0.0', '-v, --version', '显示版本')
  .parse(process.argv)
```

- `parse()` 方法用来解析传入的参调，必须调用，并且一般在代码最后调用。
- `version()` 方法用来实现 `-v` 查看版本信息。

此外，只要调用了 parse 方法，commander 会添加一个 `-h` 的选项，用来显示帮助信息。

在 version 方法之后，我们可以使用 `option()` 方法定义参数，这些选项会在帮助信息里显示。

```js
program
  .version('1.0.0', '-v, --version', '显示版本')
  .option('-t --time', '显示日期')
  .option('-d --date', '显示时间')
  .parse(process.argv)
```

添加了选项，也就是参数之后，我们需要调用 `action()` 方法传入一个回调函数，这个函数会在我们执行命令时调用，我们可以在回调函数里获取参数，并根据参数执行不同的代码逻辑。

```js
program
  .action((commander) => {
    const date = new Date()

    // 如果传递了 --time 或 -t 参数
    if (commander.time) {
      console.log(`${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}`)
      return;
    }

    // 如果传递了 --date 或 -d 参数
    if (commander.date) {
      console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
      return;
    }

    console.log(date)
  })
```

回调函数的 `commander` 参数指向 program 对象，如果一个参数成功传入， `commander.[arg name]` 就会为 `true`， 因此我们可以通过 `if (commander.time)` 来判断用户有没有传入 `--time` 或 `-t` 参数。

如果传入了，就运行对应该的代码。

完整的 `index.js` 代码如下：

```js
#!/usr/bin/env node

const program = require('commander')

program
  .version('1.0.0', '-v, --version', '显示版本')
  .description('displays the current system time')
  .option('-t --time', '显示日期')
  .option('-d --date', '显示时间')
  .action((commander) => {
    const date = new Date()
    if (commander.time) {
      console.log(`${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}`)
      return;
    }

    if (commander.date) {
      console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
      return;
    }

    console.log(date)
  })
  .parse(process.argv)
```


修改 `index.js` 后，再次调用 showtime 命令

```bash
showtime -h
# Usage: showtime [options]#

# displays the current system time#

# Options:
#   -v, --version  显示版本
#   -t --time      显示日期
#   -d --date      显示时间
#   -h, --help     output usage information

showtime -v
# 1.0.0
```

可以看到，执行 `showtime -h` 或者 `showtime --help` 会显示帮助信息。

Commander 的复杂用法，[npm commander](https://www.npmjs.com/package/commander) 上写的非常详细，这里就不在多说，留给你自行发掘。

## 参考

- [npm Docs bin](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin)
- [Node.js process 进程](http://Node.js.cn/api/process.html)
- [npm commander](https://www.npmjs.com/package/commander)

## Keywords

`Linux` `命令行` `node` `Node.js` `commander` `cli`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2021-11-19 23:21:00 -->
<!-- updateAt 2021-11-19 23:52:00 -->
