// interface Attr {
//   [key in string]: any
// }

type Child = Node | string

const React = {
  createElement
}

function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

export default React
