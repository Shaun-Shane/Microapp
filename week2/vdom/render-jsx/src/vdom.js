const createElement = (type, props, ...children) => {
  if (props === null) props = {}
  return {
    type,
    props,
    children
  }
}

function isElementVdom(vdom) {
  return typeof vdom == 'object' && typeof vdom.type == 'string';
}

function isTextVdom (vdom) {
  return typeof vdom == 'string' || typeof vdom == 'number'
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
    for (const child of vdom.children) {
      render(child, dom)
    }
    for (const prop in vdom.props) {
      setAttribute(dom, prop, vdom.props[prop]);
    }
  }
}

const data = {
  item1: 'bbb',
  item2: 'ddd'
}
const jsx = <ul className="list">
  <li className="item" style={{ background: 'blue', color: 'pink' }} onClick={() => alert(2)}>aaa</li>
  <li className="item">{data.item1}</li>
  <li className="item">{data.item2}</li>
</ul>

render(jsx, document.getElementById('app'))
