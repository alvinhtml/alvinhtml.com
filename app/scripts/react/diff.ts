import {setAttribute, setComponentProps, createComponent} from './react-dom'

export function diff(dom, vnode, container) {
  const result = diffNode(dom, vnode)

  if (container) {
    container.appendChild(result)
  }

  return result
}

export function diffNode(dom, vnode) {
  let output = dom

  // 如果 vnode 是数字
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  // 如果 vnode 是字符串
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode
      }
    } else {
      output = document.createTextNode(vnode)

      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(output, dom)
      }
    }
    return output
  }

  if (typeof vnode.tag === 'function') {
    output = diffComponent(output, vnode)
    return output
  }

  // 非文本 DOM 节点
  if (!dom) {
    output = document.createElement(vnode.tag)
  }

  // 比较子节点（dom节点和组件）
  if (vnode.children && vnode.children.length > 0 || (output.childNodes.length > 0)) {
    diffChildren(output, vnode.children)
  }

  diffAttribute(output, vnode)
  return output
}

function diffComponent(dom, vnode) {
  let comp = dom
  // 如果组件没有变化， 重新设置 props
  if (comp && comp.constructor === vnode.tag) {
    setComponentProps(comp, vnode.attrs)

    dom = comp.base
  } else {
    if (comp) {
      unmountComonent(comp)
      comp = null
    }
    // 1. 创建新的组件
    comp = createComponent(vnode.tag, vnode.attrs)
    // 2. 设置组件属性
    setComponentProps(comp, vnode.attrs)
    // 3. 给当前挂载 base
    dom = comp.base
  }
  return dom
}

function unmountComonent(comp) {
  removeNode(comp.base)
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom)
  }
}

function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes
  const children: Array<Node|undefined> = []
  const keyed = {}

  // 将有 key 的节点（用对象保存）和没有key的节点（用数组保存）分开
  if (domChildren.length > 0) {
    Array.from(domChildren).forEach((item: Node) => {
      // 获取key
      const key = item['key'];
      if (key) {
        // 如果key存在,保存到对象中
        keyed[key] = item;
      } else {
        // 如果key不存在,保存到数组中
        children.push(item)
      }
    })
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length
    Array.from(vchildren).filter((vchild: any) => vchild !== null && vchild !== undefined).forEach((vchild: any, i) => {
      // 获取虚拟DOM中所有的key
      const key = typeof vchild === 'object' ? vchild['key'] : null
      let child
      if (key) {
        // 如果有 key， 找一对应的 key 值的节点
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (childrenLen > min) {
        // 如果没有 key，则优先找类型相同的节点
        for (let j = min; j < childrenLen; j++) {
          let c = children[j]
          if (c) {
            child = c
            children[j] = undefined
            if (j === childrenLen - 1) {
              childrenLen--
            }
            if (j === min) {
              min++
            }
            break
          }
        }
      }
      // 对比
      child = diffNode(child, vchild)

      // 更新 DOM
      const f = domChildren[i]

      if (child && child !== dom && child !==f) {
        // 如果更新前的对应位置为空， 说明此节点是新增的
        if (!f) {
          dom.appendChild(child)
        // 如果更新后的节点和更新前对应位置的下一个节点一样
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          dom.insertBefore(child, f)
        }
      }
    })
  }
}

function diffAttribute(dom, vnode) {
  const oldAttrs = <object>{}
  const newAttrs = vnode.attrs
  const attrs = dom.attributes

  Array.from(attrs).forEach((item: any) => {
    oldAttrs[item.name] = item.value
  })

  // 比较
  // 如果原来的属性跟新的属性对比，不在新的属性中，则将其移除掉
  for (let key in <object>oldAttrs) {
    if (!(<string>key in newAttrs)) {
      setAttribute(dom, key, undefined)
    }
  }

  // 更新
  // 如果原来的属性和新的属性不相等
  for (let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key])
    }
  }
}
