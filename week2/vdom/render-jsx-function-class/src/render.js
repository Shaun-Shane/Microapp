function isElementVdom (vdom) {
  return typeof vdom == 'object' && typeof vdom.type == 'string';
}

function isTextVdom (vdom) {
  return typeof vdom == 'string' || typeof vdom == 'number'
}

function isComponentVdom (vdom) {
  return typeof vdom.type == 'function';
}

const setAttribute = (dom, key, value) => {
  if (typeof value == 'function' && key.startsWith('on')) {
    const eventType = key.slice(2).toLowerCase()
    dom.addEventListener(eventType, value)
  } else if (key == 'style' && typeof value == 'object') {
    Object.assign(dom.style, value)
  } else if (typeof value != 'object' && typeof value != 'function') {
    dom.setAttribute(key, value)
  }
}

const render = (vdom, parent = null) => {
  const mount = parent ? (el => parent.appendChild(el)) : (el => el)
  if (isTextVdom(vdom)) {
    return mount(document.createTextNode(vdom))
  } else if (isElementVdom(vdom)) {
    const dom = mount(document.createElement(vdom.type))

    for (const child of [].concat(...vdom.children)) {
      render(child, dom)
    }

    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
  } else if (isComponentVdom(vdom)) {
    /**
     * 如果是 vdom 是一个组件，那么就创建 props 作为参数传入（props 要加上 children）
     * 执行该函数组件，拿到返回的 vdom 再渲染。
     */
    const props = Object.assign({}, vdom.props, {
      children: vdom.children
    })

    if (Component.isPrototypeOf(vdom.type)) {
      const instance = new vdom.type(props) // constructor

      instance.componentWillMount()

      const componentVdom = instance.render()
      instance.dom = render(componentVdom, parent)

      instance.componentDidMount()

      return instance.dom
    } else {
      const componentVdom = vdom.type(props) // function call
      return render(componentVdom, parent)
    }
  }
}

class Component {
  constructor (props) {
    this.props = props || {}
    this.state = null
  }

  setState (nextState) {
    this.state = nextState
  }

  componentWillMount () {
    return undefined
  }

  componentDidMount () {
    return undefined
  }
}

const createElement = (type, props, ...children) => {
  if (props === null) props = {}
  return {
    type,
    props,
    children
  }
}