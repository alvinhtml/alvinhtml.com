import React, { Component } from 'react'

export default class Menu extends Component {

  render() {

    return (
      <ul className="menu">
        <li>
          <a href="/index.html"><i className="icon-home" /> 首页</a>
        </li>

        <li>
          <a><i className="icon-bookmark" /> 文章</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="/article/web.html">前端</a>
            <a className="dropdown-item" href="/article/developer.html">开发者</a>
            <a className="dropdown-item" href="/article/algorithm.html">算法</a>
            <a className="dropdown-item" href="/article/computer.html">计算机</a>
            <a className="dropdown-item" href="/article/linux.html">Linux</a>
          </div>
        </li>

        <li>
          <a href="">< i className="icon-dropbox" /> 项目</a>
        </li>

        <li>
          <a href="http://note.alvinhtml.com/" target="_blank">< i className="icon-book-open" /> 笔记</a>
        </li>

        <li>
          <a href="http://me.alvinhtml.com/" target="_blank">< i className="icon-user-circle" /> 简历</a>
        </li>
      </ul>
    )
  }
}
