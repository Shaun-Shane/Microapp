// 获取函数所有参数名
function getParameterName (fnStr) {
    const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const DEFAULT_PARAMS = /=[^,)]+/mg;
    const FAT_ARROWS = /=>.*$/mg;
    let code = fnStr
    code = code
        .replace(COMMENTS, '')
        .replace(FAT_ARROWS, '')
        .replace(DEFAULT_PARAMS, '');
    let result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}

// 获取函数名
function getFnName (fnStr) {
    fnStr = fnStr.substr(0, fnStr.indexOf('('))
    let index = fnStr.length - 1
    while (index >= 0 && fnStr[index] !== ' ' && fnStr[index] !== '/') --index
    return fnStr.substr(index + 1)
}

// 将 alert 转换为 postMessage
function transformAlert (body) {
    let start = body.indexOf('alert'), end = -1, count = 0
    if (start === -1) return body

    for (let i = start; i < body.length; i++) {
        if (body[i] === '(') ++count
        else if (body[i] === ')') {
            if ((--count) === 0) end = i
        }
    }

    let alertContent = body.substr(body.indexOf('(', start) + 1, end - start - 6)
    const newStr = `postMessage({ type: 'alert', text: ${'`${'+alertContent+'}`'}})`

    body = body.substr(0, start) + newStr + body.substr(end + 1)

    return body
}

let functions = {}
function addFn(func) {
    const body = transformAlert(func.substr(func.indexOf('{')))
    const funcName = getFnName(func)
    const newFunc = new Function(...[].concat(getParameterName(func)), body)
    functions[funcName] = newFunc
}

self.onmessage = (e) => {
    if (e.data.type) {
        if (e.data.type === 'addFn') addFn(e.data.func)
        else if (e.data.type === 'invoke') {
            const func = e.data.func
            const params = e.data.params
            postMessage(functions[func](...[].concat(params)))
        }
        return
    }
    const tmp = e.data.func
    const params = e.data.params
    const body = transformAlert(tmp.substr(tmp.indexOf('{')))
    // 根据函数体、参数建立函数
    const func = new Function(...[].concat(getParameterName(tmp)), body);
    // 运行
    self.postMessage(func(...[].concat(params)))
}