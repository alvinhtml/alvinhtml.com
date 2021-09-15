import React, { Component, createRef } from 'react'

export default class Header extends Component {
  search = createRef<HTMLDivElement>()
  state = {
    searchOpened: false
  }
  constructor(props) {
    super(props)
  }

  handleClick() {
    this.setState({
      searchOpened: true
    })
  }

  handleBlur() {
    this.setState({
      searchOpened: false
    })
  }

  render() {
    const {searchOpened} = this.state

    return (
      <nav>
        <div className="container">
          <div className="navbar-brand"><a href="">Alvin</a></div>
          <div className="navbar-collapse">
            <ul>
              <li>
                <a href=""><i className="fa fa-home" /> 首页</a>
              </li>
              <li>
                <a href=""><i className="fa fa-bookmark" /> 文章</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href=""><i className="fa fa-code" /> 前端</a>
                  <a className="dropdown-item" href=""><i className="fa fa-code" /> 后端</a>
                  <a className="dropdown-item" href=""><i className="fa fa-code" /> 算法</a>
                  <a className="dropdown-item" href=""><i className="fa fa-code" /> 计算机</a>
                </div>
              </li>
              <li>
                <a href="">项目</a>
              </li>
              <li>
                <a href="">笔记</a>
              </li>
            </ul>
            <ul>
              <li style={{position: 'relative'}}>
                <div className={`header-search ${searchOpened ? 'opened' : ''}`} ref={this.search}>
                  <span><i className="fa fa-search" /></span>
                  <input placeholder="搜索什么..." onFocus={this.handleClick.bind(this)} onBlur={this.handleBlur.bind(this)} type="text"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
