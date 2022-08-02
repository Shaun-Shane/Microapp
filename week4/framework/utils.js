import fs from 'fs'

function pageCode (page) {
    page = page.split('.')[0]
    return `import { render } from '../mini-react/mini-react.js'\n`
    + `import { invoke } from '../invoke.js'\n`
    + `import ${page[0].toUpperCase() + page.substr(1)} from './pages/${page}.js'\n\n`
    + `const container = document.getElementById('root')\n`
    + `const view = new ${page[0].toUpperCase() + page.substr(1)}()\n`
    + `render(view.render(), container)\n`
}

export function insertScriptToHtml () {
    const html = fs.readFileSync('index.html', 'utf-8')
    const pos = html.indexOf('</body>') + 7
    const resultHtml = html.substr(0, pos)
                    + '\n  <script type="module" src="./dist/master.js"></script>'
                    + html.substr(pos)
    fs.writeFileSync('framework/index.html', resultHtml)
}

export function loadPage (page) { // page can be index page1 page2...
    // load js
    fs.writeFileSync('framework/dist/master.js', pageCode(`${page.toLowerCase()}.js`))
    console.log('load success!')
}

function replaceMethodsStr(code, range) {
    const str = code.substr(range.start, range.end - range.start + 1)

    console.log(range)
    return range.end
}

function changeStr (code, index) {
    let bracketCount = 0
    let funcStart = -1, funcEnd = -1
    while (index < code.length) {
        const prevCount = bracketCount
        if (code[index] === '{') bracketCount++
        else if (code[index] === '}') bracketCount--

        if (prevCount > 0 && bracketCount === 0) {
            break
        }

        if (bracketCount === 1) {
            if (prevCount === 1) { // start of function
                if (funcStart === -1 && typeof (code[index]) == 'string') {
                    funcStart = index
                }
            } else if (prevCount > 1) { // end of function
                if (code[index] === '}') {
                    funcEnd = index
                    index = replaceMethodsStr(code, { start: funcStart, end: funcEnd})
                    funcStart = funcEnd = -1
                }
            }
        }
        ++index
    }
}

export function changeMethods (code) {
    const str = 'methods = '
    let index = code.indexOf(str)
    while (index !== -1) {
        changeStr(code, index + str.length)
        index = code.indexOf(str, index + 1)
    }
    return code
}