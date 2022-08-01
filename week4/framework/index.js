import babelTransformSync from './transform.js'
import fs from 'fs'
import liveServer from 'live-server'

function pageCode (page) {
    page = page.split('.')[0]
    return `import { render } from '../mini-react/mini-react.js'\n`
    + `import { invoke } from '../invoke.js'\n`
    + `import ${page[0].toUpperCase() + page.substr(1)} from './pages/${page}.js'\n\n`
    + `const container = document.getElementById('root')\n`
    + `const view = new ${page[0].toUpperCase() + page.substr(1)}()\n`
    + `render(view.render(), container)\n`
}

function insertScriptToHtml () {
    const html = fs.readFileSync('index.html', 'utf-8')
    const pos = html.indexOf('</body>') + 7
    const resultHtml = html.substr(0, pos)
                    + '\n  <script type="module" src="./dist/master.js"></script>'
                    + html.substr(pos)
    fs.writeFileSync('framework/index.html', resultHtml)
}

function loadPage (page) { // page can be index page1 page2...
    // load js
    fs.writeFileSync('framework/dist/master.js', pageCode(`${page.toLowerCase()}.js`))
    console.log('load success!')
}

try {
    // 编译 pages 中的 jsx
    const jsx = fs.readFileSync('pages/index.jsx', 'utf8')
    console.log('transforming...')
    const trans = babelTransformSync(jsx)
    fs.writeFileSync('framework/dist/pages/index.js', trans.code)
    console.log('success!')

    // insert <script> into html
    insertScriptToHtml()
    // load pages/index
    loadPage('index')

    liveServer.start({
        root: 'framework'
    })
} catch (err) {
    console.log(err)
}

/**
 * 
 * 
 * var params = {
        port: 8181, // Set the server port. Defaults to 8080. 
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
        root: "/public", // Set root directory that's being served. Defaults to cwd. 
        open: false, // When false, it won't load your browser by default. 
        ignore: 'scss,my/templates', // comma-separated string for paths to ignore 
        file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
        mount: [['/components', './node_modules']], // Mount a directory to a route. 
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
        middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
    };
 */