import React, { Component } from 'react'
import ReactDOM from 'react-dom'


import Header from './components/header'
import Banner from './components/banner'
import LeftSidebar from './components/leftSidebar'
// import Content from './components/content'


// import "@fortawesome/fontawesome-free/js/all.js";
// import "@fortawesome/fontawesome-free/css/all.css";

// import 'react-miniui/dist/miniui.css'
import '../styles/main'
import '../styles/style'
import 'highlight.js/styles/atom-one-light'


// console.log("React", React);

// function Main() {
//   return (
//     <div>
//
//       <Banner />
//       <Content />
//     </div>
//   )
// }

ReactDOM.render(<Header />, document.querySelector('#header'))
ReactDOM.render(<Banner />, document.querySelector('#banner'))
ReactDOM.render(<LeftSidebar />, document.querySelector('#leftSidebar'))
