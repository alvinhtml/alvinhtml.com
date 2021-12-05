import React, { Component, createRef } from 'react'

export default class Catalog extends Component {

  catalog = createRef<HTMLDivElement>()

  state: {
    catalogs: Array<any>
  }

  constructor(props) {
    super(props)
    this.state = {
      catalogs: []
    }
  }

  componentDidMount() {
    const markdownSection = document.querySelector('#markdownSection')
    if (markdownSection) {
      const children = markdownSection.children

      // 提取标题，并转化为树结构
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

      this.setState({
        catalogs: res
      })



      setTimeout(() => {
        const catalog = this.catalog.current
        const rect: DOMRect | undefined = catalog?.getBoundingClientRect()

        if (catalog && rect) {
          const top = document.documentElement.scrollTop + rect.top
          // console.log("rect", rect, document.documentElement.scrollTop);

          if (document.documentElement.scrollTop > (top - 62)) {
            catalog.classList.add('fixed')
          } else {
            catalog.classList.remove('fixed')
          }

          window.addEventListener('scroll', (e) => {
            // console.log("top", top, document.documentElement.scrollTop);

            if (document.documentElement.scrollTop > (top - 62)) {
              catalog.classList.add('fixed')
            } else {
              catalog.classList.remove('fixed')
            }
          })
        }
      }, 500)
    }
  }

  render() {

    if (this.state.catalogs.length < 1) {
      return null
    }

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
      <div className="card catalog" ref={this.catalog}>
        {renderCatalog(this.state.catalogs)}
      </div>
    )
  }
}
