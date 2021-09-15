import Component from './component'
import {
  diff,
  diffNode
} from './diff'

const ReactDOM = {
  render
}

function render(vnode, container, dom?: undefined | any) {
  if (vnode !== null && vnode !== undefined) {
    diff(dom, vnode, container)
  }
}

export function createComponent(comp, props) {
  let inst
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
  } else {
    inst = new Component(props)
    inst.constructor = comp
    inst.render = function() {
      return this.constructor(props)
    }
  }
  return inst
}

export function renderComponent(comp) {
  let base
  const vnode = comp.render()

  base = diffNode(comp.base, vnode)

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate()
    comp.base = base
  }

  comp.base = base
}

export function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.componentWillMount) {
      comp.componentWillMount()
    }
  } else {
    if (comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps()
    }
  }

  // 设置属性
  comp.props = props
  renderComponent(comp)
}

function _render(vnode) {

  // 如果 vnode 是数字
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  // 如果 vnode 是字符串
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  const {
    tag,
    attrs
  } = vnode

  // 如果 tag 是函数
  if (typeof tag === 'function') {
    // 1. 创建组件
    const comp = createComponent(tag, attrs)

    // 2. 设置组件的属性
    setComponentProps(comp, attrs)
    // 3. 组件渲染的节点对象返回
    return comp.base
  }

  // 否则就是虚拟 DOM 对象
  const dom = document.createElement(tag)

  // 渲染属性
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }

  // 渲染子节点
  vnode.children.forEach((child) => render(child, dom))

  return dom
}


export function setAttribute(dom, key, value) {
  if (key === 'className') {
    key = 'class'
  }

  if (/on\w+/.test(key)) {
    key = key.toLowerCase()
    dom[key] = value || ''
  } else {
    if (key === 'style') {
      if (!value || typeof value === 'string') {
        dom.style.cssText = value || ''
      } else {
        for (let k in value) {
          dom.style[k] = typeof value[k] === 'number' ? value[k] + 'px' : value[k]
        }
      }
    } else {
      if (key in dom) {
        dom[key] = value || ''
      }
      if (value) {
        dom.setAttribute(key, value)
      } else {
        dom.removeAttribute(key)
      }
    }
  }
}


export default ReactDOM
