import React, { Component } from 'react'
import ReactDOM from 'react-dom'


import Header from './components/Header'
import Banner from './components/Banner'
import Catalog from './components/Catalog'
import SidebarMenu from './components/SidebarMenu'
import RightSidebar from './components/RightSidebar'
// import Content from './components/content'


// import "@fortawesome/fontawesome-free/js/all.js";
// import "@fortawesome/fontawesome-free/css/all.css";

// import 'react-miniui/dist/miniui.css'
import '~/styles/main'
import '~/styles/style'
import 'highlight.js/styles/atom-one-light'

// console.log("React", React);

function Sidebar() {
  return (
    <div>
      <RightSidebar />
      <Catalog />
    </div>
  )
}

function Footer() {
  return (
    <div>
      <a href="/"><img src="/images/theme/logo.png" alt="alvin's blog - logo"/></a>
      <p>© 2016-2021 Alvin. All rights</p>
    </div>
  )
}

ReactDOM.render(<Header />, document.querySelector('#header'))
ReactDOM.render(<Banner />, document.querySelector('#banner'))
// ReactDOM.render(<Sidebar />, document.querySelector('#asideLeft'))
ReactDOM.render(<Sidebar />, document.querySelector('#asideRight'))
ReactDOM.render(<Footer />, document.querySelector('#footer'))
