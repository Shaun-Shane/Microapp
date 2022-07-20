export function createFiber(vnode, returnFiber) {
  const fiber = {
    // 数据类型，原生标签的type是字符串，函数组件的type则是函数 
    type: vnode.type,
    // 定义数据唯一性的字符串key
    key: vnode.key,
    props: vnode.props,
    // 原生标签 DOM
    // class组件 实例
    stateNode: null,

    // 第一个子fiber
    child: null,
    // 下一个兄弟fiber
    sibling: null,
    return: returnFiber,

    // 标记fiber任务类型，节点插入、更新、删除
    flags: Placement,

    index: null,

    // old fiber
    alternate: null
  }

  const { type } = vnode
  if (isStr(type)) {
    // 原生标签
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    // 函数组件、类组件
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    fiber.props = { children: vnode }
  } else {
    fiber.tag = Fragment
  }

  return fiber
}