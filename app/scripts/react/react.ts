import Component from './component'


type Child = Node | string


const React = {
  createElement,
  Component
}

function createElement(tag, attrs, ...children) {
  attrs = attrs || {}
  return {
    tag,
    attrs,
    children: children.flat(),
    key: attrs.key || null
  }
}

export default React
