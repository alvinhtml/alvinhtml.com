import React, { Component } from 'react'

import Menu from './Menu'

export default class SidebarMenu extends Component {
  state: {
    nav: Array<any>
  }
  constructor(props) {
    super(props)
    this.state = {
      nav: []
    }
  }

  render() {

    return (
      <div className="card">
        <div className="sidebar-banner banner">
          <div className="banner-title">Alvin</div>
          <div className="banner-subtitle">生当如夏花，只为绚烂一瞬</div>
        </div>
        <div className="sidebar-menu">
          <Menu />
        </div>
      </div>
    )
  }
}
