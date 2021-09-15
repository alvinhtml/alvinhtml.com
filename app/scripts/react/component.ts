import {renderComponent} from './react-dom'

export default class Component {
  props: object
  state: object

  constructor(props = {}) {
    this.props = props
    this.state = {}
  }

  setState(nextState) {
    // state 复制
    Object.assign(this.state, nextState)

    // 重新渲染
    renderComponent(this)
  }
}
