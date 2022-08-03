import fs from 'fs'

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

// 生成页面 page 的 js 代码
function pageCode (page) {
    page = page.split('.')[0]
    return `import { render } from '../mini-react/mini-react.js'\n`
    + `import ${page[0].toUpperCase() + page.substr(1)} from './pages/${page}.js'\n\n`
    + `const container = document.getElementById('root')\n`
    + `const view = new ${page[0].toUpperCase() + page.substr(1)}()\n`
    + `render(view.render(), container)\n`
}

// 将 script 标签插入 html
function insertScriptCssToHtml (page) {
    const html = fs.readFileSync('index.html', 'utf-8')
    const pos = html.indexOf('</body>') + 7
    let resultHtml = html.substr(0, pos)
                    + '\n  <script type="module" src="./dist/master.js"></script>'
                    + html.substr(pos)

    const posCss = html.indexOf('</head>')
    resultHtml = resultHtml.substr(0, posCss)
                + `\n  <link href="./dist/pages/${page}.css" rel="stylesheet">`
                + resultHtml.substr(posCss)
    fs.writeFileSync('framework/index.html', resultHtml)
}

// import page 对应的 js 到 master.js 中
function loadPage (page) { // page can be index page1 page2...
    // load js
    fs.writeFileSync('framework/dist/master.js', pageCode(`${page.toLowerCase()}.js`))
    console.log('load success!')
}

// 替换 methods 相关代码
// 例如 calc2(tmp, tmp2) { return await invoke('calc2', [tmp, tmp2]) }
function replaceMethodsStr(code, range) {
    let str = code.substr(range.start, range.end - range.start + 1)
    const prevLength = str.length
    const fnName = getFnName(str)
    code = code + `\n addFn(\`${str}\`)`

    const name = '\nasync ' + str.substr(0, str.indexOf('{'))
    const params = getParameterName(str)
    const body = `{ return await invoke(\`${fnName}\`, [${params.map(e => e).join(', ')}]) }`

    const AsyncFunc = Object.getPrototypeOf(async function() {}).constructor
    let newStr = (new AsyncFunc(...[].concat(params), body)).toString()

    newStr = name + newStr.substr(newStr.indexOf('{'))
    code = code.substr(0, range.start) + newStr + code.substr(range.end + 1)

    return {
        code: code,
        delta: newStr.length - prevLength
    }
}

// 找出 methods 中的函数代码，并替换
function changeStr (code, index) {
    let bracketCount = 0
    let funcStart = -1, funcEnd = -1
    while (index < code.length) {
        const prevCount = bracketCount
        if (code[index] === '{') bracketCount++
        else if (code[index] === '}') bracketCount--

        if (prevCount > 0 && bracketCount === 0) { // methods 结束
            break
        }

        if (bracketCount === 1) {
            if (prevCount === 1) { // start of function
                if (funcStart === -1 && typeof (code[index]) == 'string' 
                    && code[index] !== '\n' && code[index] !== ''
                    && code[index] !== ',') {
                    funcStart = index
                }
            } else if (prevCount > 1) { // end of function
                if (code[index] === '}') {
                    funcEnd = index
                    const update = replaceMethodsStr(code, { start: funcStart, end: funcEnd})
                    code = update.code
                    index += update.delta
                    funcStart = funcEnd = -1
                }
            }
        }
        ++index
    }
    return code
}

// 对代码中的 methods 部分进行修改
function changeMethods (code) {
    const str = 'methods = '
    let index = code.indexOf(str)
    while (index !== -1) {
        code = changeStr(code, index + str.length)
        index = code.indexOf(str, index + 1)
    }
    return code
}

function insertInvoke (code) {
    return 'import { addFn, invoke } from \'../../invoke.js\'\n' + code
}

export function modifyCode (code) {
    code = insertInvoke(code)
    return changeMethods(code)
}

export function load (page) {
    // insert <script> into html
    insertScriptCssToHtml(page)
    // load pages/index
    loadPage(page)
}