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

self.onmessage = (e) => {
    const tmp = e.data.func
    const params = e.data.params
    const body = tmp.substr(tmp.indexOf('{'))
    // 根据函数体、参数建立函数
    const func = new Function(...[].concat(getParameterName(tmp)), body);
    // 运行
    self.postMessage(func(...[].concat(params)))
}