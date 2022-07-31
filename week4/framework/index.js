import babelTransformSync from './transform.js'
import fs from 'fs'

function pageCode (page) {
    page = page.split('.')[0]
    return `import { render } from './mini-react/mini-react.js'\n`
    + `import ${page[0].toUpperCase() + page.substr(1)} from './dist/${page}.js'\n\n`
    + `const container = document.getElementById('root')\n`
    + `render(new ${page[0].toUpperCase() + page.substr(1)}().render(), container)\n`
}

try {
    // 编译 pages 中的 jsx
    const jsx = fs.readFileSync('pages/index.jsx', 'utf8')
    console.log('transforming...')
    const trans = babelTransformSync(jsx)
    fs.writeFileSync('framework/dist/index.js', trans.code)
    console.log('success!')

    fs.writeFileSync('framework/gen.js', pageCode('index.js'))
    console.log('gen success!')
} catch (err) {
    console.log(err)
}