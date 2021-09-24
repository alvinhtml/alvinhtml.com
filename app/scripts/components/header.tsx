import React, { Component, createRef } from 'react'

import Menu from './Menu'

export default class Header extends Component {
  nav = createRef<HTMLElement>()
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

  componentDidMount() {
    const naver = this.nav.current

    if (naver) {
      const easeOut = (t: number, b: number, c: number, d: number) => {
        return c * (t /= d) * t + b
      }

      if (document.documentElement.scrollTop > 250) {
        naver.style.backgroundColor = `rgba(50, 139, 108, 1)`
      }

      window.addEventListener('scroll', (e) => {
        if (document.documentElement.scrollTop < 250) {
          naver.style.backgroundColor = `rgba(50, 139, 108, ${easeOut(document.documentElement.scrollTop, 0, 200, 200) / 200})`
        }

        if (document.documentElement.scrollTop > 0) {
          naver.style.padding = '0.5rem 1rem'
        } else {
          naver.style.padding = '1rem'
        }
      })
    }
  }

  componentWillUnmount() {

  }

  render() {
    const {searchOpened} = this.state

    return (
      <nav ref={this.nav}>
        <div className="container">
          <div className="navbar-brand"><a href="">Alvin</a></div>
          <div className="navbar-collapse">
            <Menu />
            <ul>
              <li style={{position: 'relative'}}>
                <div className={`header-search ${searchOpened ? 'opened' : ''}`}>
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
