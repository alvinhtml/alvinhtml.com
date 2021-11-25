# nginx 开启 gzip 压缩

nginx 开启 gzip 压缩功能可以使网站的 css、js、html 等文件在传输时进行压缩，提高访问速度，进而优化nginx性能，节省流量，一般 gzip 压缩只针对文本文件，而图片视频这些很难再进行压缩的文件，因为压缩效果不好，则没有必要开启 gzip 压缩，如果想优化图片的访问性能，可以在本地压缩，并设置较长一点的生命周期让客户端缓存。

开启 gzip 后，nginx 对会符合策略的文件进行压缩，一般可以压缩到原来的 30% 甚至更小。这样，用户浏览页面的时候速度会快得多。gzip 的压缩页面需要浏览器和服务器双方都支持，实际上就是服务器端压缩，传到浏览器后浏览器解压并解析。目前大多数浏览器都支持解析 gzip 压缩过的页面。


要开启 gzip 可以配置 http，server 和 location 模块，以 http 为例，配置如下：

```
http {
    gzip on;
    gzip_min_length 2k;
    gzip_buffers 4 16k;
    gzip_comp_level 5;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff;
    gzip_vary on;

    server {
      listen       80;
    }
}
```


- gzip on;                 
  - 决定是否开启gzip模块，on 表示开启，off 表示关闭；

- gzip_min_length 10k;
  - 设置允许压缩的页面最小字节(从header头的Content-Length中获取)，当返回内容大于此值时才会使用 gzip 进行压缩，以 K 为单位，当值为 0 时，所有页面都进行压缩。
- gzip_buffers 4 16k;
  - 设置 gzip 申请内存的大小，其作用是按块大小的倍数申请内存空间，param2:int(k) 后面单位是 k。这里设置以 16k 为单位，按照原始数据大小以 16k 为单位的4倍申请内存

- gzip_comp_level 5;       
  - 设置压缩比率，最小为1，处理速度快，传输速度慢；9为最大压缩比，处理速度慢，传输速度快; 这里表示压缩级别，可以是 0 到 9 中的任一个，级别越高，压缩就越小，节省了带宽资源，但同时也消耗 CPU 资源，所以一般折中为 5

- gzip_types text/plain application/javascript;   
  - 设置需要压缩的MIME类型，非设置值不进行压缩，即匹配压缩类型

- gzip_vary on;            
  - 选择支持 vary header；改选项可以让前端的缓存服务器缓存经过 gzip 压缩的页面;

## Keywords

`nginx` `gzip` `gzip_min_length` `gzip_types`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2021-11-22 20:00:00 -->
<!-- updateAt 2021-11-22 20:00:00 -->
