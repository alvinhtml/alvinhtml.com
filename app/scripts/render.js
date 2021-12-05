/*
 * 使用 renderToStaticMarkup 在服务器端渲染，并通过 html-webpack-plugin 插值到 html 模板中
 */

import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server'

import Header from './components/Header'
import Banner from './components/Banner'
import Catalog from './components/Catalog'
import SidebarMenu from './components/SidebarMenu'
import RightSidebar from './components/RightSidebar'

function Sidebar() {
  return (
    <div>
      <RightSidebar />
      <Catalog />
    </div>
  )
}

const header = renderToStaticMarkup(<Header />).replace('[object Object]', '')
const banner = renderToStaticMarkup(<Banner />)
const sidebar = renderToStaticMarkup(<Sidebar />).replace('[object Object]', '')

module.exports = {
  header,
  banner,
  sidebar
}
