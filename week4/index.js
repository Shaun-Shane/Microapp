function createTextElement (text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement (type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === 'object' ? child : createTextElement(child)
            )
        }
    }
}

/*************************************************/
function workLoop(deadline) {
    // requestIdleCallback 给 shouldYield 赋值，告诉我们浏览器是否空闲
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1
    }

    // 没有下一个待渲染的fiber，表示所有dom渲染完成，commit到root
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }

    // 循环调用 workLoop
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 每次执行完一个单元任务（做了以下3件事），会返回下一个单元任务
// 1. 给fiber添加dom，并插入父元素
// 2. 给当前fiber的每一个子元素生成fiber节点
// 3. 找到要返回的下一个 unitOfWork
function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    // 1. 遍历当前fiber的children
    // 2. 给children里的每个child指定3个指针，分别指向其 父、子、兄弟三个节点
    while (index < elements.length) {
        const element = elements[index]

        const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
        dom: null,
        }

        if (index === 0) {
        fiber.child = newFiber
        } else {
        prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }

    // 下面的操作是返回下一个单元——nextUnitOfWork
    // 1. 优先找child
    // 2. 没有child找兄弟
    // 3. 没有兄弟，找叔叔，也就是递归到父元素的兄弟
    // 4. 没有叔叔就一直往上递归...
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
        return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

function createDom (fiber) {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    // children 被放到了 props 属性里，这里过滤掉 children
    const isProperty = key => key !== "children"

    Object.keys(fiber.props)
    .filter(isProperty)
    // 设置 dom 元素的属性，简化一下，直接赋值
    .forEach(name => dom[name] = fiber.props[name])

    return dom
}

// 被拆分成的一个一个单元的小任务
let nextUnitOfWork = null
let wipRoot = null

function render (element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        }
    }

    nextUnitOfWork = wipRoot
}

function commitRoot () {
    commitWork(wipRoot.child)
    wipRoot = null
}

// 递归插入所有dom
function commitWork (fiber) {
    if (!fiber) return

    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

/*************************************************/

const profile = (
    <div className="profile">
        <span className="profile-title">title</span>
        <h3 className="profile-content">content</h3>
        this is ...
    </div>
)

const container = document.getElementById("root")
render(profile, container)