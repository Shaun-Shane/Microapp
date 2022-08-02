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

self.onmessage = (e) => {
    const tmp = e.data.func
    const params = e.data.params
    const body = transformAlert(tmp.substr(tmp.indexOf('{')))
    // 根据函数体、参数建立函数
    const func = new Function(...[].concat(getParameterName(tmp)), body);
    // 运行
    self.postMessage(func(...[].concat(params)))
}