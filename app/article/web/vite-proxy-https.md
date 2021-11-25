# vite 中配置 proxy 代理 https

在做前端开发的时候，我们通常是启动一个 node server 方便调试代码，并且能够支持热更新，但后端提供的 api 接口往往在另一台服务器上，这时候，就需要用到代理（proxy）。

## HTTP 代理

对于普通的 http 代理，我们只需要配置代理规则即可

```js
// vite.config.ts

export default defineConfig({
  // 服务器配置
  server: {
    port: 8080,
    open: true,
    http: true,
    ssr: false,
    // 设置代理
    proxy: {
      '/api': {
        target: 'http://192.168.1.12:8081/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
    }
  }
})
```

上面这段 vite 配置，意思是在本地启动一个 node server， 端口是 `8080`，这样 `npm run dev` 后就可以在浏览器中通过 `localhost:8080` 访问网站，并且当调用以 `localhost:8080/api` 开头的接口时，都会自动代理到 `192.168.1.12:8081/api`。


## HTTPS 代理

如果代理目标是 HTTPS，就需要忽略安全证书校验，否则会出现接口状态一直 pending。忽略安全证书校验需要在 proxy 下添加 `secure` 字段，告诉 proxy 是否开启安全证书校验，默认是开启。

```js
{
  proxy: {
    "/api": {
      target: 'https://example.com',
      changeOrigin: true,
      secure: false,
      headers: {                  
        Referer: 'https://example.com'
      }
    }
  }
}
```

## 参考

- [Vite 官方中文文档](https://cn.vitejs.dev/config/#server-open)
- [github.com/http-party/node-http-proxy](https://github.com/http-party/node-http-proxy#options)

## Keywords

`vite` `proxy` `https`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2021-09-04 20:00:00 -->
<!-- updateAt 2021-09-04 20:00:00 -->
