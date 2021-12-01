import React, { Component, createRef } from 'react'

import Menu from './Menu'

import logo from '../../images/theme/logo.png'

interface Article {
  title: string
  desc: string
  category: string
  keywords: string[]
  link: string
  createAt: number
}

interface IState {
  searchOpened: boolean
  articles: Array<Article>
}

export default class Header extends Component {
  nav = createRef<HTMLDivElement>()
  input = createRef<HTMLInputElement>()
  state = {
    searchOpened: false,
    articles: []
  }
  timer: ReturnType<typeof setTimeout>
  main: HTMLElement
  mainContent: string
  constructor(props) {
    super(props)
  }

  handleClick() {
    this.setState({
      searchOpened: true
    })
    const input = this.input.current

    if (input) {
      input.focus()
    }
  }

  handleBlur(e) {
    this.setState({
      searchOpened: false
    })

    if (e.target.value === '' && this.main) {
      this.main.innerHTML = this.mainContent
    }
  }

  componentDidMount() {
    const main = document.querySelector('#main') as HTMLElement

    if (main) {
      this.main = main
      this.mainContent = main.innerHTML
    }

    fetch('/article/articles.json', {})
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.setState({
        articles: data.articles
      })
    })

    const naver = this.nav.current

    if (naver) {
      if (document.documentElement.scrollTop > 0) {
        naver.classList.add('fixed')
      }

      window.addEventListener('scroll', (e) => {
        if (document.documentElement.scrollTop > 0) {
          naver.classList.add('fixed')
        } else {
          naver.classList.remove('fixed')
        }
      })
    }
  }

  componentWillUnmount() {

  }

  handleSearch(e) {
    window.clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      const value = e.target.value
      if (this.main && value && this.state.articles.length) {
        console.log("this.main, value", this.main, value);

        this.renderSearchResult(this.state.articles.filter((article: Article) => {
          return !!article.keywords.find(v => v.toLocaleLowerCase() === value.toLocaleLowerCase())
        }))
      }
    }, 300)
  }

  renderSearchResult(articles: Array<Article>) {
    if (this.main && articles.length) {
      this.main.innerHTML = articles.map((article) => {
        return `
          <div class="markdown-section article home-item">
            <header><h1><a href="${article.link}">${article.title}</a></h1></header>
            <p>${article.desc}</p>
            <div class="tags">${article.createAt}</div>
          </div>
        `
      }).join('')
    }
  }

  render() {
    const {searchOpened} = this.state

    return (
      <div className="following" ref={this.nav}>
        <div className="container">
          <nav>
            <div className="logo">
              <img src={logo} alt="alvin's blog - logo"/>
            </div>
            <Menu />
            <div className="search-box">
              <div className={`search ${searchOpened ? 'opened' : ''}`}>
                <span onClick={this.handleClick.bind(this)}><i className="fa fa-search" /></span>
                <input ref={this.input} placeholder="搜索什么..." onChange={this.handleSearch.bind(this)} onBlur={this.handleBlur.bind(this)} type="text"/>
              </div>
            </div>
          </nav>
        </div>
      </div>
    )
  }
}
