import React, { Component } from 'react'

export default class LeftSidebar extends Component {
  state: {
    nav: Array<any>
  }
  constructor(props) {
    super(props)
    this.state = {
      nav: []
    }
  }

  componentDidMount() {
    const markdownSection = document.querySelector('#markdownSection')
    if (markdownSection) {
      const children = markdownSection.children

      const items = Array.from(children)
        .filter((item: Element) => item instanceof HTMLHeadingElement)
        .map((item: Element) => {
          return {
            level: parseInt(item.tagName.replace('H', ''), 10),
            title: item.textContent
          }
        })

      const toTree = (list, level) => {
        const result: any = []
        let children: any = []
        let current

        list.forEach(item => {
            if (item.level === level) {
              current = {
                title: item.title,
                children: []
              }
              children = current.children
              result.push(current)
            } else {
              children.push(item)
            }
        })

        result.forEach(element => {
          if (element.children.length > 0) {
            element.children = toTree(element['children'], level + 1)
          }
        })

        return result
      }

      const res = toTree(items, 2)
      console.log("res", res);

      this.setState({
        nav: res
      })

      setTimeout(() => {
        const catalogBox: HTMLDivElement | null = document.querySelector('#catalogBox')
        if (catalogBox) {
          const rect: DOMRect | null = catalogBox.getBoundingClientRect()

          window.addEventListener('scroll', (e) => {
            if (rect) {
              if (document.documentElement.scrollTop > (rect.y - 20)) {
                catalogBox.classList.add('fixed')
              } else {
                catalogBox.classList.remove('fixed')
              }
            }
          })
        }
      }, 300)
    }
  }

  render() {
    const renderCatalog = list => {
      if (list.length > 0) {
        return (
          <ul>
            {
              list.map((item, i) => (
                <li key={i}>
                  <a href={`#${item.title.toLowerCase().replace(/ +/g, '-')}`}>{item.title}</a>
                  {
                    item.children && renderCatalog(item.children)
                  }
                </li>
              ))
            }
          </ul>
        )
      } else {
        return null
      }
    }

    return (
      <div className="card catalog" id="catalogBox">
        {renderCatalog(this.state.nav)}
      </div>
    )
  }
}
