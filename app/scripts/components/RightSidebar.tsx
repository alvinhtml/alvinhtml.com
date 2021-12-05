import React, { Component } from 'react'

export default class RightSidebar extends Component {
  state: {
    articleCount: number,
    categoryCount: number,
    keywords: number,
  }
  constructor(props) {
    super(props)
    this.state = {
      articleCount: 0,
      categoryCount: 0,
      keywords: 0,
    }
  }

  componentDidMount() {
    fetch('/article/articles.json', {})
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({
          articleCount: data.articleCount,
          categoryCount: data.categorys.length,
          keywords: data.keywords.length,
        })
      })
  }

  render() {
    const {articleCount, categoryCount, keywords} = this.state

    return (
      <div className="card prefile">
        <div className="avator">
          <img src="/images/theme/avator-me.jpg" alt="Alvin Yang"/>
        </div>
        <div className="name">Alvin</div>
        <div className="site-state">
          <div className="item">
            <strong className="item-count">{articleCount}</strong>
            <span className="item-name">文章</span>
          </div>
          <div className="item">
            <strong className="item-count">{categoryCount}</strong>
            <span className="item-name">分类</span>
          </div>
          <div className="item">
            <strong className="item-count">{keywords}</strong>
            <span className="item-name">标签</span>
          </div>
        </div>
        <div className="social-share">
          <a className="github" href="https://github.com/alvinhtml" target="_blank">
            <i className="icon-github-circled" />
          </a>
          <a className="twitter" href="">
            <i className="icon-twitter" />
          </a>
          <a className="facebook" href="">
            <i className="icon-facebook-squared" />
          </a>
        </div>
      </div>
    )
  }
}
