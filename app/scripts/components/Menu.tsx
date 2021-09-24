import React, { Component } from 'react'

export default class Menu extends Component {

  render() {

    return (
      <ul>
        <li>
          <a href="/index.html"><i className="fa fa-fw fa-home" /> 首页</a>
        </li>
        
        <li>
          <a><i className="fa fa-fw fa-bookmark" /> 文章</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="/article/web.html"><i className="fa fa-fw fa-html5" /> 前端</a>
            <a className="dropdown-item" href="/article/developer.html"><i className="fa fa-fw fa-server" /> 后端</a>
            <a className="dropdown-item" href="/article/algorithm.html"><i className="fa fa-fw fa-code" /> 算法</a>
            <a className="dropdown-item" href="/article/computer.html"><i className="fa fa-fw fa-linux" /> 计算机</a>
          </div>
        </li>

        <li>
          <a href="">< i className="fa fa-fw fa-dropbox" /> 项目</a>
        </li>

        <li>
          <a href="">< i className="fa fa-fw fa-book" /> 笔记</a>
        </li>
      </ul>
    )
  }
}
