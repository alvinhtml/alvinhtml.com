import React, { Component, createRef } from 'react'

import Menu from './Menu'

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
  nav = createRef<HTMLElement>()
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
      <nav ref={this.nav}>
        <div className="container">
          <div className="navbar-brand"><a href="">Alvin</a></div>
          <div className="navbar-collapse">
            <Menu />
            <ul>
              <li style={{position: 'relative'}}>
                <div className={`header-search ${searchOpened ? 'opened' : ''}`}>
                  <span><i className="fa fa-search" /></span>
                  <input placeholder="搜索什么..." onChange={this.handleSearch.bind(this)} onFocus={this.handleClick.bind(this)} onBlur={this.handleBlur.bind(this)} type="text"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
