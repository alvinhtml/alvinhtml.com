// // 实现一个简单的 React createElement 功能
import React from './react/react'
//
// 实现 ReactDOM 的 render 功能
import ReactDOM from './react/react-dom'
//
// import Header from './components/header'

import '../styles/main'
import '../styles/style'
import 'highlight.js/styles/atom-one-light'

console.log("React", React);

function Main() {
  return (
    <div><strong>hello world</strong></div>
  )
}

ReactDOM.render(<Main />, document.querySelector('#root'))
