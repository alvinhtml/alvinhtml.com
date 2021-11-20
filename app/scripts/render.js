/*
 * 使用 renderToStaticMarkup 在服务器端渲染，并通过 html-webpack-plugin 插值到 html 模板中
 */

import * as React from 'react';
import {renderToStaticMarkup, renderToString} from 'react-dom/server'

import Header from './components/Header'
import Banner from './components/Banner'
import LeftSidebar from './components/LeftSidebar'
import SidebarMenu from './components/SidebarMenu'
import RightSidebar from './components/RightSidebar'

function Sidebar() {
  return (
    <div>
      <SidebarMenu />
      <LeftSidebar />
    </div>
  )
}

const header = renderToStaticMarkup(<Header />)
const banner = renderToStaticMarkup(<Banner />)
const sidebar = renderToStaticMarkup(<Sidebar />)
const rightSidebar = renderToStaticMarkup(<RightSidebar />).replace('[object Object]', '')

module.exports = {
  header,
  banner,
  sidebar,
  rightSidebar
}
